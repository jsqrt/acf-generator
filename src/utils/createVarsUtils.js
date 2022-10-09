import { getTabChar } from ".";

export const createVarsRoot = ({
  isSectionVars = false,
  nestingLevel = 1,
  rootVarName,
} = {}) => {
  const closePhp = document.createTextNode(`\n${getTabChar(nestingLevel)}?>\n`);
  const root = document.createElement('mark');
  const varsBlock = document.createElement('mark');
  const contentBlock = document.createElement('mark');

  root.classList.add('_root');
  varsBlock.classList.add('_vars');
  contentBlock.classList.add('_content');

  if (!isSectionVars) {
    const openBrace = document.createTextNode(`\n${getTabChar(nestingLevel)}<?php if (${rootVarName}) {`);
    root.append(openBrace);
  } else {
    const openPhp = document.createTextNode(`\n${getTabChar(nestingLevel)}<?php`);
    root.append(openPhp);
  }

  root.append(varsBlock);
  root.append(closePhp);
  root.append(contentBlock);

  if (!isSectionVars) {
    const closeBrace = document.createTextNode(`\n${getTabChar(nestingLevel)}<?php } ?>\n`);
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