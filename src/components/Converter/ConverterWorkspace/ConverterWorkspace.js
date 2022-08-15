import React, {
  useEffect,
  useState,
  useContext,
} from 'react';
import { Textarea } from '../../Forms';
import { ConverterTabs } from '../ConverterTabs';

import {
  initPageConfig,
  createFieldConfig,
  checkNodeContainsIgnoreClasses,
  defineTextFieldLabel,
  checkPHPVarsInitializated,
} from '../utils';

import '../../../scss/components/converter/_converter_workspace.scss';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';

const ConverterWorkspace = () => {
  const [fieldKeyCounter, setFieldKeyCounter] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);

  useEffect(() => {
    setFieldsData(initPageConfig({
      updateFieldId: setFieldKeyCounter,
      pageTitle: 'About page',
      insertPath: fieldsData,
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

  const createTextField = (parent, child, sectionKey, section, fieldKey) => {
    checkPHPVarsInitializated(fieldsData[currentPageIndex].fields[sectionKey], section);

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

    section.insertAdjacentHTML('afterbegin', getField); // place variable
    child.textContent = callField; // place output field
  };

  const createLinkField = (parent, child, sectionKey, section, fieldKey) => {
    checkPHPVarsInitializated(fieldsData[currentPageIndex].fields[sectionKey], section);

    const {
      suggestedName,
      fieldNames,
    } = fieldsData[currentPageIndex].fields[sectionKey];
    let fieldName = 'link';

    fieldNames[fieldName] = fieldNames[fieldName] >= 1 ? fieldNames[fieldName] += 1 : 1;

    const fieldId = `${suggestedName}_${fieldName}_${fieldNames[fieldName]}`;
    const fieldVarName = `$${fieldName}_${fieldNames[fieldName]}`;
    const getField = ` \n\t\t${fieldVarName} = get_field('${fieldId}');`;

    const varLinkUrl = `$link_url = ${fieldVarName}['url'];`
    const varLinkTitle = `$link_title = ${fieldVarName}['title'];`
    const varLinkTarget = `$link_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`
    const variablesGroup = `<?php if (${fieldVarName}) {\n\t${varLinkUrl}\n\t${varLinkTitle}\n\t${varLinkTarget}\n ?&gt;\n`;

    const callLinkUrl = `<?php echo esc_url($link_url); ?>`;
    const callLinkTarget = `<?php echo esc_attr($link_target); ?>`;
    const callLinkTitle = `<?php echo esc_html($link_title); ?>`;

    const closeTag = `\n&lt;?php }; ?&gt;`;

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

    section.insertAdjacentHTML('afterbegin', getField); // place variable
    child.insertAdjacentHTML('beforebegin', variablesGroup);
    child.href = callLinkUrl;
    child.target = callLinkTarget;
    child.textContent = callLinkTitle;
    child.insertAdjacentHTML('afterend', closeTag);
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

  const checkNestingText = (children) => { // if p span etc in text fields
    return children.filter((child) => {
      if (
        (child.classList && !child.classList.length && child.nodeName !== 'SOURCE')
        || (child.nodeName === '#text' && !(child.textContent.replace(/\s+/g, '')))
      ) {
        child.remove();
        return false;
      } else {
        return true;
      }
    });
  };

  const childrenIteration = (parent, sectionKey, section, fieldId = sectionKey, nestingLevel = 0) => {
    let children = Array.from(parent.childNodes);
    let newFieldKey = fieldId;

    if (!children.length) return newFieldKey;

    // console.log('--------'); //!
    // console.log(children); //!
    // console.log('--------'); //!

    children = checkNestingText(children);

    children.forEach((child, childIndex) => {
      let currentNestingLevel = nestingLevel + 1;

      const { nodeName } = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || checkNodeContainsIgnoreClasses(child, ignoreNodeClassNames)
      ) return;
      else if (nodeName === '#text' && child.textContent.replace(/\s+/g, '') !== '') { // if its just text
        newFieldKey += 1;
        createTextField(parent, child, sectionKey, section, newFieldKey);
      }
      else if (nodeName === 'A') {
        createLinkField(parent, child, sectionKey, section, newFieldKey);
        newFieldKey = childrenIteration(child, sectionKey, section, newFieldKey, currentNestingLevel);
      }
      // else if (nodeName === 'PICTURE') {
      //   // newFieldKey += 1;
      //   // createPicture(sectionId, parent, child);
      // }
      else {
        newFieldKey = childrenIteration(child, sectionKey, section, newFieldKey, currentNestingLevel);
      }

      if (child.insertAdjacentHTML) {
        child.insertAdjacentHTML('beforebegin', `\n${'\t'.repeat(currentNestingLevel)}`);
        if (childIndex === children.length - 1) child.insertAdjacentHTML('afterend', `\n${'\t'.repeat(currentNestingLevel - 1)}`);
      }

    });

    console.log('----------------------------'); //!

    return newFieldKey;
  };

  const separateSections = ($sectionsNodes) => {
    fieldsData[currentPageIndex].fields = {};

    let currentFieldKey = fieldKeyCounter;

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

      // ПО ФАКТУ, ЭТО СЕЙЧАС НЕ НУЖНО. НУЖНО БУДЕТ ТОЛЬКО ПРИ СОЗДАНИИ JSON
      // createFieldConfig({
      //   insertPath: fieldsData[currentPageIndex].fields,
      //   type: 'tab',
      //   label: sectionLabel,
      //   fieldId: currentFieldKey,
      //   section: $sectionNode,
      //   suggestedName: sectionSuggestedName,
      // });


      fieldsData[currentPageIndex].fields[currentFieldKey] = createFieldConfig({
        type: 'group',
        fieldName: sectionSuggestedName,
        fieldId: currentFieldKey,
        section: $sectionNode,
        sectionLabel,
        label: sectionLabel,
        suggestedName: sectionSuggestedName,
        varsInitializated: false,
        fieldNames: {},
        groupSubFields: [],
      });

      const newFieldKey = childrenIteration($sectionNode, currentFieldKey, $sectionNode);

      const varsBlockOpenTag = '\n\t<?php';
      $sectionNode.insertAdjacentHTML('afterbegin', varsBlockOpenTag);

      const phpOutput = $sectionNode.outerHTML.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/-->/gi, '').replace(/!--/gi, '');
      fieldsData[currentPageIndex].fields[currentFieldKey].phpOutput = phpOutput;

      currentFieldKey = newFieldKey + 1;
    });

    setFieldKeyCounter(currentFieldKey);
  };

  const handleMainInput = (e) => {
    const { target } = e;
    const { value } = target;
    if (value === '') return;

    const DOM = document.createElement('div');
    DOM.innerHTML = value;
    const $sectionsNodes = DOM.querySelectorAll('section');

    separateSections($sectionsNodes);

    setFieldsData([...fieldsData])
  };

  useEffect(() => {
  }, [fieldKeyCounter]);

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
        <ConverterTabs tabsArray={tabsArray} />
      </div>
    </div>
  );
};

export default ConverterWorkspace;
