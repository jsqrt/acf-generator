import {
  // checkPHPVarsInitializated,
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
  prevObj,
  key,
  groupKeys,
  fieldKey,
  fieldConfig,
  fieldName,
  index,
}) => {
  let i = index || 0;

  if (groupKeys.length - 1 === i) {
    if (fieldName) {
      if (prevObj[key].fieldNames[fieldName] === undefined) {
        prevObj[key].fieldNames[fieldName] = 1;
      } else {
        prevObj[key].fieldNames[fieldName] += 1;
      }

      return prevObj[key].fieldNames[fieldName];
    }

    if (fieldConfig) {
      prevObj[key].sub_fields[fieldKey] = fieldConfig;
    }

    return;
  };
  i += 1;

  return changeDeepProperty({
    prevObj: prevObj[key].sub_fields,
    key: groupKeys[i],
    groupKeys,
    fieldKey,
    fieldConfig,
    fieldName,
    index: i,
  });
};

export const createSomeField = ({
  parent,
  child,
  fieldKey,
  fieldsData,
  currentPageIndex,
  varsNestingLevel,
  inheritedVarName,
  groupKeys,
  fieldName,
  inheritType,
  fieldType,

  nestingLevel,
  callNestingLevel,
}, callback = () => null) => {
  const { suggestedName } = fieldsData[currentPageIndex].fields[groupKeys[0]];

  const fieldNameIteration = changeDeepProperty({
    prevObj: fieldsData[currentPageIndex].fields,
    groupKeys,
    fieldName,
    key: groupKeys[0],
  });

  const fieldSubId = inheritedVarName ? fieldName : [suggestedName, fieldName].join('_');
  const fieldId = addNameIterationToStr(fieldSubId, fieldNameIteration)
  const fieldVarName = addNameIterationToStr('$'.concat(fieldName), fieldNameIteration)
  const fieldLabel = addNameIterationToStr(fieldName, fieldNameIteration)

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
  });

  changeDeepProperty({
    prevObj: fieldsData[currentPageIndex].fields,
    key: groupKeys[0],
    groupKeys,
    fieldKey,
    fieldConfig,
  });

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

export const createImgField = (data) => {
  const callback = ({
    child,
    fieldVarName,
    varsNestingLevel,
  }) => {
    const indent = `\n${getTabChar(varsNestingLevel)}`;

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
    callNestingLevel,
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