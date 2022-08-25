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
  toUpperFirstLetter,
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

    const fieldLabel = `${fieldName}${fieldNames[fieldName] !== 1 ? ` ${fieldNames[fieldName]}` : ''}`;
    let type;

    switch (fieldName) {
      case 'descr': type = 'wysiwyg'; break;
      case 'text': type = 'wysiwyg'; break;
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

    section.insertAdjacentHTML('afterbegin', getField); // place variable
    child.textContent = callField; // place output field
  };

  const createLinkField = (parent, child, sectionKey, section, fieldKey, currentNestingLevel) => {
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

    const varLinkUrl = `\n${'\t'.repeat(currentNestingLevel + 1)}$link_url = ${fieldVarName}['url'];`
    const varLinkTitle = `\n${'\t'.repeat(currentNestingLevel + 1)}$link_title = ${fieldVarName}['title'];`
    const varLinkTarget = `\n${'\t'.repeat(currentNestingLevel + 1)}$link_target = ${fieldVarName}['target'] ? ${fieldVarName}['target'] : '_self';`
    const variablesGroup = `\n${'\t'.repeat(currentNestingLevel)}<?php if (${fieldVarName}) {${varLinkUrl}${varLinkTitle}${varLinkTarget}\n ${'\t'.repeat(currentNestingLevel)}?&gt;\n`;

    const callLinkUrl = `<?php echo esc_url($link_url); ?>`;
    const callLinkTarget = `<?php echo esc_attr($link_target); ?>`;
    const callLinkTitle = `<?php echo esc_html($link_title); ?>`;

    const closeTag = `\n${'\t'.repeat(currentNestingLevel)}&lt;?php }; ?&gt;\n`;

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

  // # 1
  // #text span
  // Если текст контент

  const textTags = ['A','P','SPAN','STRONG','B','I','BR','H1','H2','H3','H4','H5','H6','UL','OL','LI'];

  const checkNodeOnText = (node) => {
    const hasClassList = !!node.classList && !!node.classList.length;
    const isTextTag = !!textTags.indexOf(node.nodeName);
    return node.nodeName === '#text' || (isTextTag && !hasClassList);
  }

  const checkNestingText = (parent, children) => { // if p span etc in text fields, we replace these children with textNode
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

  const childrenIteration = (parent, sectionKey, section, fieldId = sectionKey, nestingLevel = 0) => {
    let children = Array.from(parent.childNodes);
    let newFieldKey = fieldId;

    if (!children.length) return newFieldKey;

    children = checkNestingText(parent, children);

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
        newFieldKey += 1;
        createLinkField(parent, child, sectionKey, section, newFieldKey, currentNestingLevel);
        // newFieldKey = childrenIteration(child, sectionKey, section, newFieldKey, currentNestingLevel);
      }
      // else if (nodeName === 'PICTURE') {
      //   // newFieldKey += 1;
      //   // createPicture(sectionId, parent, child);
      // }
      else {
        newFieldKey = childrenIteration(child, sectionKey, section, newFieldKey, currentNestingLevel);
      }

      child.before(`\n${'\t'.repeat(currentNestingLevel)}`);
      if (childIndex === children.length - 1) child.after(`\n${'\t'.repeat(currentNestingLevel - 1)}`);
    });

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
        sectionLabel = toUpperFirstLetter(sectionSuggestedName); // get section name
      } else {
        sectionSuggestedName = `section_${index + 1}`;
        sectionLabel = `Section ${index + 1}`;
      }

      fieldsData[currentPageIndex].fields[currentFieldKey] = createFieldConfig({
        type: 'tab',
        label: sectionLabel,
        fieldId: currentFieldKey,
        suggestedName: sectionSuggestedName,
      });


      fieldsData[currentPageIndex].fields[currentFieldKey + 1] = createFieldConfig({
        type: 'group',
        fieldName: sectionSuggestedName,
        fieldId: currentFieldKey + 1,
        section: $sectionNode,
        sectionLabel,
        suggestedName: sectionSuggestedName,
        varsInitializated: false,
        fieldNames: {},
        groupSubFields: [],
      });

      const newFieldKey = childrenIteration($sectionNode, currentFieldKey + 1, $sectionNode);

      const varsBlockOpenTag = '\n\t<?php';
      $sectionNode.insertAdjacentHTML('afterbegin', varsBlockOpenTag);

      const phpOutput = $sectionNode.outerHTML.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/-->/gi, '').replace(/!--/gi, '');
      fieldsData[currentPageIndex].fields[currentFieldKey + 1].phpOutput = phpOutput;

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
        <Textarea
          id="main_input"
          defaultValue="
          <section class='section contacts'>
            <div class='contacts__in'>
              <div class='contacts__text fadeEl'>
                <p class='contacts__descr'>This expertise has seen us produce
                  <strong> Europe’s largest 360 fan experience </strong>
                  for Live Nation, transport ABC television audiences through time in a
                  <strong> world first virtual reality experience, </strong>
                  and produce the
                  <strong> UK’s first immersive gym group for Studio Society.. </strong>
                </p>
                <p>And we’re not finished there. As our pioneering industry continues to break new ground, Pebble remains at the forefront of creative innovation and experiential storytelling</p>
                <span class='contacts__decor'>123</span>
              </div>
            </div>
          </section>"
          // defaultValue="
          // <section class='section'>
          //  <p class='te'>2</p>
          //   1
          //  <p class='te'>2</p>
          // </section>"
          handleInput={handleMainInput}
        />
      </div>
      <div className="converter_workspace__col">
        <ConverterTabs tabsArray={tabsArray} />
      </div>
    </div>
  );
};

export default ConverterWorkspace;
