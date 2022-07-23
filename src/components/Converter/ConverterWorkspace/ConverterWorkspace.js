import React, { useEffect, useState } from 'react';
import { Textarea } from '../../Forms';
import { ConverterTabs } from '../ConverterTabs';

import '../../../scss/components/converter/_converter_workspace.scss';

const ConverterWorkspace = () => {
  const [mainInputContent, setMainInputContent] = useState('');

  const [tabsArray, setTabsArray] = useState([
    {
      value: '',
      placeholder: '',
      // disabled: false,
      id: 'converter_tabs_textarea_1',
    },
    {
      value: '',
      placeholder: '',
      // disabled: false,
      id: 'converter_tabs_textarea_2',
    },
  ]);

  const ignoreNodeClassNames = [
    'list',
  ]

  const createField = (parent, textContent) => {

  };

  const checkNodeContainsIgnoreClasses = (node) => {
    return (node.classList && Array.from(node.classList)
      .filter((str) => ignoreNodeClassNames
        .filter((ignore) => str
          .includes(ignore))
            .length > 0).length > 0);
  }

  const childrenIteration = (parent) => {
    const children = Array.from(parent.childNodes);

    if (!children.length) return;

    children.forEach((child) => {
      const { nodeName } = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || checkNodeContainsIgnoreClasses(child)
      ) return;

      if (nodeName === '#text') {
        child.textContent = createField(parent, child.textContent);
        return;
      }
    });
  };

  const handleMainInput = (e) => {
    const { target } = e;
    const { value } = target;

    if (value === '') return;

    const DOM = document.createElement('div');
    DOM.innerHTML = value;

    const $sectionsNodes = DOM.querySelectorAll('section');
    const sectionsData = [];

    $sectionsNodes.forEach(($sectionNode, index) => {
      let classList = Object.values($sectionNode.classList);
      if (classList.length) {
        classList = classList.filter((str) =>
          !str.includes('section')
          && !str.includes('state')
          && !str.includes('mod')
        );
      }
      const sectionSuggestedName = classList[0] ? classList[0] : `section_${index}`;

      sectionsData.push({
        id: index,
        suggestedName: sectionSuggestedName,
      });


      childrenIteration($sectionNode);

      // console.log($sectionNode.childNodes); //!
    });
  };


  return (
    <div className='converter_workspace'>
      <div className="converter_workspace__col">
        <Textarea id="main_input" defaultValue="Type smth" handleInput={handleMainInput} />
      </div>
      <div className="converter_workspace__col">
        <ConverterTabs tabsArray={tabsArray} />
      </div>
    </div>
  );
};

export default ConverterWorkspace;
