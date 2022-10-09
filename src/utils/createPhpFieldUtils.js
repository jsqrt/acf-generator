import produce from "immer";
import {
  defineTextFieldLabel,
  toUpperFirstLetter,
  getTabChar,
  defineImgFieldLabel,
} from ".";

import { createFieldConfig } from "./createConfigUtils";
import { addToVarsGroup, createVarsRoot } from "./createVarsUtils";

export const addNameIterationToStr = (str, fieldNameIteration) => {
  if (fieldNameIteration) return str.concat('_').concat(fieldNameIteration);
  return str;
};

const changeDeepProperty = ({
  fieldsData,
  currentPageKey,
  groupKeys,
  fieldName,
  fieldConfig,
  fieldKey,
}) => {

  let counter = 0;

  let data = fieldsData || fieldConfig;

  if (fieldName) {
    switch (groupKeys.length) {
      case 1: {
        if (data[currentPageKey].fields[groupKeys[0]].fieldNames[fieldName]) {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].fieldNames[fieldName] += 1});
        } else {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].fieldNames[fieldName] = 1});
        }
        counter = data[currentPageKey].fields[groupKeys[0]].fieldNames[fieldName];
        break;
      }
      case 2: {
        if (data[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].fieldNames[fieldName]) {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].fieldNames[fieldName] += 1});
        } else {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].fieldNames[fieldName] = 1});
        }
        counter = data[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].fieldNames[fieldName];
        break;
      }
      case 3: {
        if (data[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[groupKeys[2]].fieldNames[fieldName]) {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[groupKeys[2]].fieldNames[fieldName] += 1});
        } else {
          data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[groupKeys[2]].fieldNames[fieldName] = 1});
        }
        counter = data[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[groupKeys[2]].fieldNames[fieldName];
        break;
      }
      default: break;
    }
  }

  if (fieldConfig) {
    switch (groupKeys.length) {
      case 1: {
        data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[fieldKey] = fieldConfig});
        break;
      }
      case 2: {
        data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[fieldKey] = fieldConfig});
        break;
      }
      case 3: {
        data = produce(data, draft => {draft[currentPageKey].fields[groupKeys[0]].sub_fields[groupKeys[1]].sub_fields[groupKeys[2]].sub_fields[fieldKey] = fieldConfig});
        break;
      }
      default: break;
    }
  }

  return {
    data,
    counter,
  }
};

export const createSomeField = ({
  parent,
  child,
  fieldKey,
  fieldsData,
  currentPageKey,
  inheritedVarName,
  groupKeys,
  fieldName,
  inheritType,
  fieldType,
  pictureBrickKey,

  nestingLevel,
  callNestingLevel,
}, callback = () => null) => {
  const { suggestedName } = fieldsData[currentPageKey].fields[groupKeys[0]];

  const { counter: fieldNameCounter, data: dataUpdatedFieldNameCounter } = changeDeepProperty({
    groupKeys,
    fieldName,
    currentPageKey,
    fieldsData,
  });

  fieldsData = dataUpdatedFieldNameCounter;

  const fieldSubId = inheritedVarName ? fieldName : [suggestedName, fieldName].join('_');
  const fieldId = addNameIterationToStr(fieldSubId, fieldNameCounter)
  const fieldVarName = addNameIterationToStr('$'.concat(fieldName), fieldNameCounter)
  const fieldLabel = addNameIterationToStr(fieldName, fieldNameCounter)

  const indent = `\n${getTabChar(callNestingLevel)}`;
  let getField;

  if (inheritedVarName) {
    getField = `${indent}${fieldVarName} = ${inheritedVarName}['${fieldId}'];`;
  } else {
    getField = `${indent}${fieldVarName} = get_field('${fieldId}');`;
  }

  let type;

  switch (fieldName) {
    case 'descr' || 'text': type = 'wysiwyg'; break;
    default: type = inheritType || 'text';
  }

  const fieldConfig = createFieldConfig({
    type,
    defaultValue: fieldType === 'text' ? (child.textContent !== '_reserved' ? child.textContent : '') : '',
    name: fieldId,
    label: fieldLabel,
    fieldId: fieldKey,
    pictureBrickKey,
  });

  const { data: dataUpdatedFieldConfig } = changeDeepProperty({
    groupKeys,
    currentPageKey,
    fieldsData,
    fieldConfig,
    fieldKey,
  });

  fieldsData = dataUpdatedFieldConfig;


  if (inheritType === 'group' || child.nodeName === '#text') {
    addToVarsGroup(parent, getField);
  } else {
    addToVarsGroup(child, getField);
  }

  callback({
    suggestedName,
    fieldVarName,
    child,

    nestingLevel,
    callNestingLevel,
  });

  return {
    fieldVarName,
  }
};

export const createPictureField = (data) => {
  const callback = ({
    child,
    fieldVarName,
    nestingLevel,
    callNestingLevel,
  }) => {
    const indent = `${getTabChar(nestingLevel)}`;
    const childImg = child.querySelector('img');
    const imgClass = childImg.classList ? Array.from(childImg.classList).join(' ') : '';
    const picClass = child.classList ? Array.from(child.classList).join(' ') : '';

    const callPicture = `
${indent}<?php if (${fieldVarName}) { ?>
  ${indent}<?php MTDUtils::the_picture(
    ${indent}${fieldVarName},
    ${indent}array( 'class' => '${picClass}', 'img_class' => '${imgClass}' )
  ${indent}); ?>
${indent}<?php } ?>`;

    child.before(callPicture);
    child.remove();
  };

  const { fieldVarName } = createSomeField(
    {
      ...data,
      inheritType: 'picture',
      fieldName: defineImgFieldLabel(data.child),
    },
    callback,
  );

  return {
    varName: fieldVarName,
  }
};

export const createImgField = (data) => {
  const callback = ({
    child,
    fieldVarName,
    nestingLevel,
    callNestingLevel,
  }) => {
    const indent = `\n${getTabChar(callNestingLevel)}`;

    const varLinkUrl = `${indent}${fieldVarName}_url = ${fieldVarName}['url'];`
    const varLinkTitle = `${indent}${fieldVarName}_alt = ${fieldVarName}['alt'];`

    addToVarsGroup(child, varLinkUrl);
    addToVarsGroup(child, varLinkTitle);

    const callLinkUrl = `<?php echo esc_url(${fieldVarName}_url); ?>`;
    const callLinkAlt = `<?php echo esc_attr(${fieldVarName}_alt); ?>`;

    child.src = callLinkUrl;
    child.alt = callLinkAlt;
  };

  const { fieldVarName } = createSomeField(
    {
      ...data,
      fieldType: 'img',
      fieldName: defineImgFieldLabel(data.child),
    },
    callback,
  );

  return {
    varName: fieldVarName,
  }
};

export const createTextField = (data) => {
  const callback = ({
    child,
    fieldVarName,
  }) => {
    data.child.textContent = `<?php echo ${fieldVarName}; ?>`; // place output field
  };

  const { fieldVarName } = createSomeField(
    {
      ...data,
      fieldType: 'text',
      fieldName: defineTextFieldLabel(data.parent),
    },
    callback,
  );

  return {
    varName: fieldVarName,
  }
};

export const createGroupField = (data) => {
  const callback = ({
    child,
    fieldVarName,
    nestingLevel,
    callNestingLevel,
  }) => {
    const { root, contentBlock, varsBlock } = createVarsRoot({
      nestingLevel: nestingLevel - 1,
      rootVarName: fieldVarName,
    });

    child.before(root);
    contentBlock.append(child);
  };

  const { fieldVarName } = createSomeField(
    {
      ...data,
      fieldName: 'group',
      inheritType: 'group',
    },
    callback,
  );

  return {
    fieldVarName,
  };
};

export const createLinkField = (data) => {
  const callback = ({
    child,
    fieldVarName,
    nestingLevel,
  }) => {
    const indent = `\n${getTabChar(nestingLevel)}`;

    const varLinkUrl = `${indent}${fieldVarName}_url = ${fieldVarName}['url'];`
    const varLinkTitle = `${indent}${fieldVarName}_title = ${fieldVarName}['title'];`
    const varLinkTarget = `${indent}${fieldVarName}_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`

    addToVarsGroup(child, varLinkUrl);
    addToVarsGroup(child, varLinkTitle);
    addToVarsGroup(child, varLinkTarget);

    const callLinkUrl = `<?php echo esc_url(${fieldVarName}_url); ?>`;
    const callLinkTarget = `<?php echo esc_attr(${fieldVarName}_target); ?>`;

    child.href = callLinkUrl;
    child.target = callLinkTarget;
  };

  const { fieldVarName } = createSomeField(
    {
      ...data,
      fieldType: 'link',
      fieldName: 'link',
    },
    callback,
  );
  const linkTextVarCall = `<?php echo ${fieldVarName}_title; ?>`;

  return {
    varName: fieldVarName,
    linkTextVarCall,
  }
};