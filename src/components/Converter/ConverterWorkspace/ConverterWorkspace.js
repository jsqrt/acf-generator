import React, { useEffect, useState } from 'react';
import { Textarea } from '../../Forms';
import { ConverterTabs } from '../ConverterTabs';

import {
  initPageConfig,
  createFieldConfig
} from '../utils';

import '../../../scss/components/converter/_converter_workspace.scss';

const ConverterWorkspace = ({
  pageTitle,
}) => {
  const [mainInputContent, setMainInputContent] = useState('');
  const [fieldKeyCounter, setFieldKeyCounter] = useState(null);
  const [sectionsData, setSectionsData] = useState([]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  useEffect(() => {
    setSectionsData(initPageConfig({
      updateFieldId: setFieldKeyCounter,
      pageTitle: 'About page',
      insertPath: sectionsData,
    }));
  }, []);

  const [tabsArray, setTabsArray] = useState([
    {
      // disabled: false,
      id: 'converter_tabs_textarea_1',
      accordeon: true,
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
    'swiper-wrapper',
  ];

  const checkVarsInitialization = (sectionObj, section) => {
    if (!sectionObj.varsInitializated) {
      const varsBlockCloseTag = '\n\t?>\n'
      sectionObj.varsInitializated = true;
      section.insertAdjacentHTML('afterbegin', varsBlockCloseTag);
    }
  };

  const createTextField = (parent, child, sectionFieldId, section) => {
    checkVarsInitialization(sectionsData[currentPageIndex].fields[sectionFieldId], section);

    const {
      suggestedName,
      fieldNames,
    } = sectionsData[currentPageIndex].fields[sectionFieldId];
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

    fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

    const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;
    const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;
    const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;
    const callField = `<?php echo ${fieldVarName}; ?>`;

    createFieldConfig({
      insertPath: sectionsData[currentPageIndex].fields[sectionFieldId].sub_fields,
      type: 'wysiwyg',
      defaultValue: child.textContent,
      name: fieldId,
      label: `${fieldName}_${fieldNames[fieldName]}`,

      fieldId: fieldKeyCounter,
      updateFieldId: setFieldKeyCounter,
    });

    section.insertAdjacentHTML('afterbegin', getField); // place variable
    child.textContent = callField; // place output field
  };

  // const createPicture = (sectionId, parent, child) => {
  //   checkVarsInitialization(sectionsData[sectionId]);
  //   const { section, suggestedName, fieldNames } = sectionsData[sectionId];

  //   const sourceNodes = Array.from(child.querySelectorAll('source')) || [];
  //   const imgNode = child.querySelector('img');
  //   const sources = [];

  //   sourceNodes.push(imgNode);
  //   sourceNodes.forEach((node) => {
  //     console.log(node.getAttribute('src') || node.getAttribute('srcset')); //!
  //   });
  // };

  const checkNodeContainsIgnoreClasses = (node) => {
    return (node.classList && Array.from(node.classList)
      .filter((str) => ignoreNodeClassNames
        .filter((ignore) => str
          .includes(ignore))
            .length > 0)
              .length > 0);
  }

  const childrenIteration = (parent, sectionFieldId, section) => {
    const children = Array.from(parent.childNodes);

    if (!children.length) return;

    children.forEach((child) => {
      const { nodeName } = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || checkNodeContainsIgnoreClasses(child)
      ) return;
      else if (nodeName === '#text' && child.textContent.replace(/\s+/g, '') !== '') {
        createTextField(parent, child, sectionFieldId, section);
        return;
      }
      else if (nodeName === 'PICTURE') {
        // createPicture(sectionId, parent, child);
        return;
      }
      else {
        childrenIteration(child, sectionFieldId, section);
      }
    });
  };

  const separateSections = ($sectionsNodes) => {
    sectionsData[currentPageIndex].fields = {};

    $sectionsNodes.forEach(($sectionNode, index) => {
      let classList = Object.values($sectionNode.classList);
      if (classList.length) {
        classList = classList.filter((str) => // remove unnesessary clasess
          (
            !str.includes('section')
            && !str.includes('state')
            && !str.includes('mod')
          ) || str.includes('_section')
        );
      }

      let sectionSuggestedName;
      let sectionLabel;

      if (classList[0]) {
        sectionSuggestedName = classList[0]; // match first valid class
        const sectionSuggestedNameArr = sectionSuggestedName.split('');
        sectionSuggestedNameArr[0] = sectionSuggestedNameArr[0].toUpperCase();
        sectionLabel = sectionSuggestedNameArr.join('').replace(/_/g, ' '); // get section name
      } else {
        sectionSuggestedName = `section_${index}`;
        sectionLabel = `Section ${index + 1}`;
      }

      createFieldConfig({
        insertPath: sectionsData[currentPageIndex].fields,
        type: 'tab',
        label: sectionLabel,
        fieldId: fieldKeyCounter,
        section: $sectionNode,
        suggestedName: sectionSuggestedName,
        updateFieldId: setFieldKeyCounter,
      });

      createFieldConfig({
        insertPath: sectionsData[currentPageIndex].fields,
        type: 'group',
        fieldName: sectionSuggestedName,
        fieldId: fieldKeyCounter,
        section: $sectionNode,
        sectionLabel,
        suggestedName: sectionSuggestedName,
        varsInitializated: false,
        fieldNames: {},
        updateFieldId: setFieldKeyCounter,
        groupSubFields: [],
      });

      childrenIteration($sectionNode, fieldKeyCounter, $sectionNode);

      const varsBlockOpenTag = '\n\t<?php';
      $sectionNode.insertAdjacentHTML('afterbegin', varsBlockOpenTag);

      const phpOutput = $sectionNode.outerHTML.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/-->/gi, '').replace(/!--/gi, '');
      sectionsData[currentPageIndex].fields[fieldKeyCounter].phpOutput = phpOutput;
    });
  };

  const handleMainInput = (e) => {
    const { target } = e;
    const { value } = target;
    if (value === '') return;

    const DOM = document.createElement('div');
    DOM.innerHTML = value;
    const $sectionsNodes = DOM.querySelectorAll('section');

    separateSections($sectionsNodes);
    setSectionsData([...sectionsData]);
  };

  useEffect(() => {
    console.log(sectionsData);
  }, [sectionsData]);

  return (
    <div className='converter_workspace'>
      <div className="converter_workspace__col">
        <Textarea id="main_input" defaultValue="<section class='section about'>
<h1 class='section section_title'>Title</h2>
<p class='section section_descr'>Title</p>
<img src='test image1' alt='image1' />
<picture class='card__img'>
  <source srcset='images/card__img.png.webp' type='image/webp'>
  <source srcset='images/card__img.png' type='image/png'>
  <img class='card__img_in' src='images/card__img.png' alt='card' loading='lazy'>
</picture>
</section>" handleInput={handleMainInput} />
      </div>
      <div className="converter_workspace__col">
        <ConverterTabs tabsArray={tabsArray} sectionsData={sectionsData} />
      </div>

    </div>
  );
};

export default ConverterWorkspace;
