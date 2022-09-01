export const checkNodeContainsIgnoreClasses = (node, ignoreNodeClassNames) => {
  return (node.classList && Array.from(node.classList)
    .filter((str) => ignoreNodeClassNames
      .filter((ignore) => str
        .includes(ignore))
          .length > 0)
            .length > 0);
};


export const defineTextFieldLabel = (parent) => {
  let fieldName = 'text';

  Array.from(parent.classList).forEach((str) => {
    if (str.includes('title')) fieldName = 'title';
    if (str.includes('descr')) fieldName = 'descr';
    if (str.includes('text')) fieldName = 'text';
    if (str.includes('subtitle')) fieldName = 'subtitle';
    if (str.includes('name')) fieldName = 'name';
    if (str.includes('position')) fieldName = 'position';
    if (str.includes('label')) fieldName = 'label';
    if (str.includes('value')) fieldName = 'value';
  });

  return fieldName;
}

// export const checkPHPVarsInitializated = (sectionObj, section) => {
//   // if (!sectionObj.varsInitializated) {
//   //   const varsBlockCloseTag = '\n\t?>\n'
//   //   sectionObj.varsInitializated = true;
//   //   section.insertAdjacentHTML('afterbegin', varsBlockCloseTag);
//   // }
// };

export const toUpperFirstLetter = (str) => {
  const stringArray = str.split('');
  stringArray[0] = stringArray[0].toUpperCase();
  return stringArray.join('').replace(/_/g, ' ');
};

export const getTabChar = (n) => {
  return '\t'.repeat(n);
};

export const textTags = ['A','P','SPAN','STRONG','B','I','BR','H1','H2','H3','H4','H5','H6','UL','OL','LI'];

export const checkNodeOnText = (node) => {
  const hasClassList = !!node.classList && !!node.classList.length;
  const isTextTag = textTags.indexOf(node.nodeName) > -1;

  return node.nodeName === '#text' || (isTextTag && !hasClassList);
}

export const checkNestingText = (parent, children) => { // if p span etc in text fields, we replace these children with textNode
  const nodesWithoutSpaces = children.filter((child, index) => {
    const isText = checkNodeOnText(child);

    if (isText && child.textContent.replace(/\s+/g, '') === '') {
      child.remove();
      return false;
    }

    return true;
  });

  let textCounter = 0;
  const textNodeIndex = [];

  const filteredNodesArray = nodesWithoutSpaces.filter((child, index) => {
    const isText = checkNodeOnText(child);

    if (isText) {
      textCounter += 1;

      if (textCounter === 1) {
        const el = document.createTextNode('_reserved');
        child.after(el);
        textNodeIndex.push([el, index]);
      }

      child.remove();
      return false;
    }

    return true;
  });

  if (textNodeIndex.length) {
    textNodeIndex.forEach(([el, prevTextIndex]) => {
      if (filteredNodesArray[prevTextIndex]) {
        filteredNodesArray.splice(prevTextIndex, 0, el);
      } else {
        filteredNodesArray.push(el);
      }
    });
  }

  return filteredNodesArray;
};