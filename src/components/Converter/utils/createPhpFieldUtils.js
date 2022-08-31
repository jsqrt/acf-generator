import {
  // checkPHPVarsInitializated,
  defineTextFieldLabel,
  toUpperFirstLetter,
  getTabChar,
} from ".";

import { createFieldConfig } from "./createConfigUtils";


export const createVarsRoot = ({ isSectionVars = false } = {}) => {
  const closePhp = document.createTextNode('\n\t?>\n');
  const root = document.createElement('div');
  const varsBlock = document.createElement('div');
  const contentBlock = document.createElement('div');

  root.classList.add('_root');
  varsBlock.classList.add('_vars');
  contentBlock.classList.add('_content');


  if (!isSectionVars) {
    const openBrace = document.createTextNode('\n\t<?php if ($link) {');
    root.append(openBrace);
  } else {
    const openPhp = document.createTextNode('\n\t<?php');
    root.append(openPhp);
  }

  root.append(varsBlock);
  root.append(closePhp);
  root.append(contentBlock);

  if (!isSectionVars) {
    const closeBrace = document.createTextNode('\n\t<?php } ?>\n');
    root.append(closeBrace);
  }

  return {
    root,
    varsBlock,
    contentBlock,
  };
};

export const addToVarsGroup = (parent, phpVar) => {
  const closestContent = parent.closest('._content');

  if (closestContent) {
    closestContent.previousElementSibling.append(phpVar);
  }
};

export const createTextField = ({
  parent,
  child,
  sectionKey,
  section,
  fieldKey,
  fieldsData,
  currentPageIndex,
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
  const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;
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
  section,
  fieldKey,
  currentNestingLevel,
  fieldsData,
  currentPageIndex,
}) => {
  // checkPHPVarsInitializated(fieldsData[currentPageIndex].fields[sectionKey], section);

  const {
    suggestedName,
    fieldNames,
  } = fieldsData[currentPageIndex].fields[sectionKey];
  let fieldName = 'link';

  fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

  const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;
  const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;
  const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;

  const varLinkUrl = `\n${getTabChar(currentNestingLevel + 1)}$link_url = ${fieldVarName}['url'];`
  const varLinkTitle = `\n${getTabChar(currentNestingLevel + 1)}$link_title = ${fieldVarName}['title'];`
  const varLinkTarget = `\n${getTabChar(currentNestingLevel + 1)}$link_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`
  // const variablesGroup = `\n${getTabChar(currentNestingLevel)}<?php if (${fieldVarName}) {${varLinkUrl}${varLinkTitle}${varLinkTarget}\n ${getTabChar(currentNestingLevel)}?&gt;\n`;

  const callLinkUrl = `<?php echo esc_url($link_url); ?>`;
  const callLinkTarget = `<?php echo esc_attr($link_target); ?>`;
  // const callLinkTitle = `<?php echo esc_html($link_title); ?>`;

  child.href = callLinkUrl;
  child.target = callLinkTarget;

  fieldsData[currentPageIndex]
    .fields[sectionKey]
    .sub_fields[fieldId] = createFieldConfig({
      insertPath: fieldsData[currentPageIndex].fields[sectionKey].sub_fields,
      type: 'wysiwyg',
      defaultValue: child.textContent,
      name: fieldId,
      label: `${fieldName}_${fieldNames[fieldName]}`,
      fieldId: fieldKey,
    });

  const {root, contentBlock, varsBlock } = createVarsRoot();

  section.insertAdjacentHTML('afterbegin', getField);

  child.before(root);
  contentBlock.append(child);
  varsBlock.append(varLinkUrl);
  varsBlock.append(varLinkTitle);
  varsBlock.append(varLinkTarget);
};

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
