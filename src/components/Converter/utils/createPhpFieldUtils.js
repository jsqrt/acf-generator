import {
  // checkPHPVarsInitializated,
  defineTextFieldLabel,
  toUpperFirstLetter,
  getTabChar,
} from ".";

import { createFieldConfig } from "./createConfigUtils";
import { addToVarsGroup, createVarsRoot } from "./createVarsUtils";

export const generatePathToField = (keys) => {
  return keys.join('.sub_fields');
};

export const createTextField = ({
  parent,
  child,
  sectionKey,
  fieldKey,
  fieldsData,
  currentPageIndex,
  varsNestingLevel,
  inheritedVarName,
}) => {
  // checkPHPVarsInitializated(fieldsData[currentPageIndex].fields[sectionKey], section);

  const {
    suggestedName,
    fieldNames,
  } = fieldsData[currentPageIndex].fields[sectionKey];
  let fieldName = defineTextFieldLabel(parent);

  fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

  const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;

  const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;

  const getField = inheritedVarName ? ` \n${getTabChar(varsNestingLevel)}${fieldVarName} = ${inheritedVarName}['${fieldId}'];` : ` \n${getTabChar(varsNestingLevel)}${fieldVarName} = get_field('${fieldId}');`;

  const callField = `<?php echo ${fieldVarName}; ?>`;

  const fieldLabel = `${fieldName}${fieldNames[fieldName] !== 1 ? ` ${fieldNames[fieldName]}` : ''}`;
  let type;

  switch (fieldName) {
    case 'descr' || 'text': type = 'wysiwyg'; break;
    default: type = 'text';
  }

  fieldsData[currentPageIndex]
    .fields[sectionKey]
    .sub_fields.push(createFieldConfig({
      type,
      defaultValue: child.textContent !== '_reserved' ? child.textContent : '',
      name: fieldId,
      label: toUpperFirstLetter(fieldLabel),
      fieldId: fieldKey,
    }));

  addToVarsGroup(parent, getField);
  child.textContent = callField; // place output field
};

export const createLinkField = ({
  parent,
  child,
  sectionKey,
  fieldKey,
  fieldsData,
  currentPageIndex,
  varsNestingLevel,
  groupKeys,
}) => {

  const {
    suggestedName,
    fieldNames,
  } = fieldsData[currentPageIndex].fields[sectionKey];
  let fieldName = 'link';

  fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

  const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;
  const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;
  const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;

  const varLinkUrl = `\n${getTabChar(varsNestingLevel)}$link_url = ${fieldVarName}['url'];`
  const varLinkTitle = `\n${getTabChar(varsNestingLevel)}$link_title = ${fieldVarName}['title'];`
  const varLinkTarget = `\n${getTabChar(varsNestingLevel)}$link_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`
  // const variablesGroup = `\n${getTabChar(currentNestingLevel)}<?php if (${fieldVarName}) {${varLinkUrl}${varLinkTitle}${varLinkTarget}\n ${getTabChar(currentNestingLevel)}?&gt;\n`;

  const callLinkUrl = `<?php echo esc_url($link_url); ?>`;
  const callLinkTarget = `<?php echo esc_attr($link_target); ?>`;
  // const callLinkTitle = `<?php echo esc_html($link_title); ?>`;

  child.href = callLinkUrl;
  child.target = callLinkTarget;

  fieldsData
    [currentPageIndex]
    [generatePathToField(groupKeys, fieldKey)] = createFieldConfig({
      type: 'wysiwyg',
      defaultValue: child.textContent !== '_reserved' ? child.textContent : '',
      name: fieldId,
      label: `${fieldName}_${fieldNames[fieldName]}`,
      fieldId: fieldKey,
    });

  const {root, contentBlock, varsBlock } = createVarsRoot({
    nestingLevel: varsNestingLevel - 1,
    rootVarName: fieldVarName,
  });

  // section.insertAdjacentHTML('afterbegin', getField);
  addToVarsGroup(parent, getField);

  child.before(root);
  contentBlock.append(child);

  varsBlock.append(varLinkUrl);
  varsBlock.append(varLinkTitle);
  varsBlock.append(varLinkTarget);

  return {
    varName: fieldVarName,
  }
};

// export const createGroupField = ({
//   parent,
//   child,
//   sectionKey,
//   fieldKey,
//   fieldsData,
//   currentPageIndex,
//   varsNestingLevel,
//   groupKeys,
// }) => {
//   const {
//     suggestedName,
//     fieldNames,
//   } = fieldsData[currentPageIndex].fields[sectionKey];
//   let fieldName = 'link';

//   fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

//   const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;
//   const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;
//   const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;

//   const varLinkUrl = `\n${getTabChar(varsNestingLevel)}$link_url = ${fieldVarName}['url'];`
//   const varLinkTitle = `\n${getTabChar(varsNestingLevel)}$link_title = ${fieldVarName}['title'];`
//   const varLinkTarget = `\n${getTabChar(varsNestingLevel)}$link_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`
//   // const variablesGroup = `\n${getTabChar(currentNestingLevel)}<?php if (${fieldVarName}) {${varLinkUrl}${varLinkTitle}${varLinkTarget}\n ${getTabChar(currentNestingLevel)}?&gt;\n`;

//   const callLinkUrl = `<?php echo esc_url($link_url); ?>`;
//   const callLinkTarget = `<?php echo esc_attr($link_target); ?>`;
//   // const callLinkTitle = `<?php echo esc_html($link_title); ?>`;

//   child.href = callLinkUrl;
//   child.target = callLinkTarget;

//   fieldsData
//     [currentPageIndex]
//     [generatePathToField(groupKeys, fieldKey)] = createFieldConfig({
//       type: 'wysiwyg',
//       defaultValue: child.textContent !== '_reserved' ? child.textContent : '',
//       name: fieldId,
//       label: `${fieldName}_${fieldNames[fieldName]}`,
//       fieldId: fieldKey,
//     });

//   const {root, contentBlock, varsBlock } = createVarsRoot({
//     nestingLevel: varsNestingLevel - 1,
//     rootVarName: fieldVarName,
//   });

//   // section.insertAdjacentHTML('afterbegin', getField);
//   addToVarsGroup(parent, getField);

//   child.before(root);
//   contentBlock.append(child);

//   varsBlock.append(varLinkUrl);
//   varsBlock.append(varLinkTitle);
//   varsBlock.append(varLinkTarget);

//   return {
//     varName: fieldVarName,
//   }
// };

    // const createPicture = (sectionId, parent, child) => {
  //   checkPHPVarsInitializated(fieldsData[sectionId]);
  //   const { section, suggestedName, fieldNames } = fieldsData[sectionId];

  //   const sourceNodes = Array.from(child.querySelectorAll('source')) || [];
  //   const imgNode = child.querySelector('img');
  //   const sources = [];

  //   sourceNodes.push(imgNode);
  //   sourceNodes.forEach((node) => {
  //     console.log(node.getAttribute('src') || node.getAttribute('srcset')); //!
  //   });
  // };
