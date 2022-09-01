import React, {
  useEffect,
  useState,
  useContext,
} from 'react';
import { Textarea } from '../../Forms';
import { ConverterTabs } from '../ConverterTabs';

import {
  checkNodeContainsIgnoreClasses,
  toUpperFirstLetter,
  checkNestingText,
  getTabChar,
} from '../utils';

import {
  initPageConfig,
  createFieldConfig,
} from '../utils/createConfigUtils';

import {
  createLinkField,
  createTextField,
} from '../utils/createPhpFieldUtils';

import {
  createVarsRoot,
} from '../utils/createVarsUtils';

import '../../../scss/components/converter/_converter_workspace.scss';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';
import { ConverterAccordeon } from '../ConverterAccordeon';

const ConverterWorkspace = () => {
  const [fieldKeyCounter, setFieldKeyCounter] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);

  const ignoreNodeClassNames = [
    'list',
    'swiper-wrapper',
    'item',
    'slider',
  ];

  const defaultInputValue = `
    <section class='section contacts'>
      <a href="$" class='123'></a>
    </section>
  `;
  // const defaultInputValue = `
  //   <section class='section contacts'>
  //     <div class='contacts__in'>
  //       <div class='contacts__text fadeEl'>
  //         <p class='contacts__descr'>This expertise has seen us produce
  //           <strong> Europe’s largest 360 fan experience </strong>
  //           for Live Nation, transport ABC television audiences through time in a
  //           <strong> world first virtual reality experience, </strong>
  //           and produce the
  //           <strong> UK’s first immersive gym group for Studio Society.. </strong>
  //         </p>
  //         <p>And we’re not finished there. As our pioneering industry continues to break new ground, Pebble remains at the forefront of creative innovation and experiential storytelling</p>
  //         <span class='contacts__decor'>123</span>
  //       </div>
  //     </div>
  //   </section>
  // `;

  const childrenIteration = ({
    parent,
    sectionKey,
    section,
    fieldId = sectionKey,
    nestingLevel = 0,
    varsNestingLevel = 2,
    inheritedVarName,
    groupKeys,
  }) => {
    console.log(groupKeys); //!

    let children = Array.from(parent.childNodes);
    let newFieldKey = fieldId;

    if (!children.length) return newFieldKey;

    if (
      parent.classList.contains('_root')
    ) {
      childrenIteration({
        parent: parent.querySelector('._content'),
        sectionKey,
        section,
        fieldId,
        nestingLevel: nestingLevel - 1,
        varsNestingLevel,
        inheritedVarName,
        groupKeys,
      });

      return newFieldKey;
    }
    children = checkNestingText(parent, children);

    children.forEach((child, childIndex) => {
      let currentNestingLevel = nestingLevel + 1;
      const { nodeName } = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || checkNodeContainsIgnoreClasses(child, ignoreNodeClassNames)
      ) return newFieldKey;
      else if (nodeName === '#text' && child.textContent.replace(/\s+/g, '') !== '') { // if its just text
        newFieldKey += 1;
        createTextField({
          parent,
          child,
          sectionKey,
          section,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          varsNestingLevel,
          inheritedVarName,
        });
      }
      else if (nodeName === 'A') {
        newFieldKey += 1;
        currentNestingLevel += 1;

        // const { varName, newGroupKeys } = createGroupField({
        //   parent,
        //   child,
        //   sectionKey,
        //   section,
        //   fieldKey: newFieldKey,
        //   fieldsData,
        //   currentPageIndex,
        //   varsNestingLevel: currentNestingLevel,
        //   groupKeys,
        // });

        const { varName, newGroupKeys } = createLinkField({
          parent,
          child,
          sectionKey,
          section,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          varsNestingLevel: currentNestingLevel,
          groupKeys,
        });

        newFieldKey = childrenIteration({
          parent: child,
          sectionKey,
          section,
          fieldId: newFieldKey,
          nestingLevel: currentNestingLevel,
          varsNestingLevel: currentNestingLevel,
          inheritedVarName: varName,
          groupKeys: newGroupKeys,
        });
      }
      // else if (nodeName === 'PICTURE') {
      //   // newFieldKey += 1;
      //   // createPicture(sectionId, parent, child);
      // }
      else {
        newFieldKey = childrenIteration({
          parent: child,
          sectionKey,
          section,
          fieldId: newFieldKey,
          nestingLevel: currentNestingLevel,
          varsNestingLevel,
          groupKeys,
        });
      }

      child.before(`\n${getTabChar(currentNestingLevel)}`);
      if (childIndex === children.length - 1) child.after(`\n${getTabChar(currentNestingLevel - 1)}`);
    });

    return newFieldKey;
  };

  const removeAllRoots = ($sectionNode) => {
    const rootSelectors = [
      '._root',
      '._content',
      '._vars',
    ];

    rootSelectors.forEach((selector) => {
      const $allRoots = Array.from($sectionNode.querySelectorAll(selector)).reverse();

      if ($allRoots.length) { // срабатывает раньше того, как цикл добежит до последнего чилда
        $allRoots.forEach(($root) => {
          const rootInner = $root.innerHTML;
          $root.insertAdjacentHTML('beforebegin', rootInner);
          $root.remove();
        });
      }
    })
  }

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

      const {root, contentBlock, varsBlock } = createVarsRoot({ isSectionVars: true, });
      const sectionInner = $sectionNode.innerHTML;

      $sectionNode.innerHTML = '';
      contentBlock.insertAdjacentHTML('afterbegin', sectionInner);
      $sectionNode.append(root);

      const newFieldKey = childrenIteration({
        parent: $sectionNode,
        sectionKey: currentFieldKey + 1,
        section: $sectionNode,
        varsNestingLevel: 2,
        groupKeys: [currentFieldKey + 1],
      });

      // const varsBlockOpenTag = '\n\t<?php';
      // $sectionNode.insertAdjacentHTML('afterbegin', varsBlockOpenTag);

      removeAllRoots($sectionNode);

      const phpOutput = $sectionNode.outerHTML.replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/-->/gi, '').replace(/!--/gi, '');
      fieldsData[currentPageIndex].fields[currentFieldKey + 1].phpOutput = phpOutput;

      currentFieldKey = newFieldKey + 1;
    });

    setFieldKeyCounter(currentFieldKey);
  };

  let inputDebouce;

  const handleMainInput = (e) => {
    const { target } = e;
    const { value } = target;
    if (value === '') return;

    clearTimeout(inputDebouce);

    inputDebouce = setTimeout(() => {
      const DOM = document.createElement('div');
      DOM.innerHTML = value;

      const $sectionsNodes = DOM.querySelectorAll('section');

      separateSections($sectionsNodes);
      setFieldsData([...fieldsData]);
    }, 200);
  };

  useEffect(() => {
    setFieldsData(initPageConfig({
      updateFieldId: setFieldKeyCounter,
      pageTitle: 'About page',
      insertPath: fieldsData,
    }));
  }, []);

  useEffect(() => {
    if (fieldsData.length && !fieldsData[currentPageIndex].initializated) {
      handleMainInput({ target: { value: defaultInputValue } });
      fieldsData[currentPageIndex].initializated = true;
    }
  }, [fieldsData]);

  useEffect(() => {
  }, [fieldKeyCounter]);

  return (
    <div className='converter_workspace'>
      <div className="converter_workspace__col">
        <Textarea
          id="main_input"
          defaultValue={defaultInputValue}
          handleInput={handleMainInput}
          placeholder='Input some section here'
        />
      </div>
      <div className="converter_workspace__col">
        <ConverterAccordeon />
        {/* <ConverterTabs tabsArray={tabsArray} /> */}
      </div>
    </div>
  );
};

export default ConverterWorkspace;
