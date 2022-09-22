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
  createPhpIcon,
} from '../utils';

import {
  initPageConfig,
  createFieldConfig,
  createPictureBrick,
} from '../utils/createConfigUtils';

import {
  createGroupField,
  createImgField,
  createLinkField,
  createPictureField,
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
	const { fieldsData, setFieldsData, settings } = useContext(FieldsDataContext);
  const [pictureBrickKey, setPictureBrickKey] = useState('');
  const [pageInitializated, setPageInitializated] = useState(false);

  // const defaultInputValue = `
  //   <section class='section contacts'>
  //     <ul class="test">
  //       <li class="test">
  //       <ul class="test">
  //       <li class="test">2</li>
  //       <li class="test">2</li>
  //       <li class="test"></li>
  //       <li class="test"></li>
  //     </ul></li>
  //       <li class="test">2</li>
  //       <li class="test"></li>
  //       <li class="test"></li>
  //     </ul>
  //   </section>
  // `;

  // const defaultInputValue = `
  //   <section class='section contacts'>
  //     <div class="1"><div class="1"><div class="1"><img src="23" alt="" class="2" /></div></div></div>
  //   </section>
  // `;

  const defaultInputValue = `
    <section class='section contacts'>
      <picture class='test'>
    <source media="(min-width: 301px)" srcset="img.webp" type='image/webp'/>
    <source media="(max-width: 300px)" srcset="img_mob.webp" type='image/webp' />
    <source media="(min-width: 301px)" srcset="img.png" type='image/png' />
    <source media="(max-width: 300px)" srcset="img_mob.png" type='image/png' />
    <img class='test1' src="img.png" alt="123" />
      </picture>
      <picture class='test'>
    <source media="(min-width: 301px)" srcset="img.webp" type='image/webp'/>
    <source media="(max-width: 300px)" srcset="img_mob.webp" type='image/webp' />
    <source media="(min-width: 301px)" srcset="img.png" type='image/png' />
    <source media="(max-width: 300px)" srcset="img_mob.png" type='image/png' />
    <img src="img.png" class='test1' alt="123" />
      </picture>
    </section>
  `;


  // const defaultInputValue = `
  //   <section class='section contacts'>
  //       <div class="div1">
  //         <div class="div2">
  //           <div href="" class="test">
  //             <div class="div3">
  //               <div class="div4">
  //                 <a class="logo" type='test'></a>
  //               </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //   </section>
  // `;
  // const defaultInputValue = `
  //   <section class='section contacts'>
  //     <div class='contacts__in'>
  //       <div class='contacts__text fadeEl'>
  //         <svg class="icon icon_arrow_down icon--size_mod">
  //           <use xlink:href="images/sprite/sprite.svg#arrow_down"></use>
  //         </svg>
  //         <p>And we’re not finished there. As our pioneering industry continues to break new ground, Pebble remains at the forefront of creative innovation and experiential storytelling</p>
  //         <span class='contacts__decor'>123</span>
  //       </div>
  //     </div>
  //   </section>
  // `;


  const childrenIteration = ({
    parent,
    section,
    inheritedVarName,
    groupKeys,
    fieldId = groupKeys[0],
    inheritedLinkTextVarCall,

    inheritedNestingLevel = 0,
    inheritedCallNestingLevel = 2,
    ignoreMarker = false,
  }) => {
    let children = Array.from(parent.childNodes); //! why childNodes ?
    let newFieldKey = fieldId;

    if (!children.length) return newFieldKey;

    if (
      parent.classList.contains('_root')
    ) {
      childrenIteration({
        parent: parent.querySelector('._content'),
        section,
        fieldId,
        inheritedVarName,
        groupKeys,

        inheritedNestingLevel,
        inheritedCallNestingLevel,
        ignoreMarker,
      });

      return newFieldKey;
    }

    children = checkNestingText(parent, children, ignoreMarker);

    children.forEach((child, childIndex) => {
      let currentNestingLevel = inheritedNestingLevel + 1;
      let currentCallNestingLevel = inheritedCallNestingLevel;
      const { nodeName } = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || nodeName === 'LI'
        || checkNodeContainsIgnoreClasses(child, settings.ignoreClasses)
        || ignoreMarker
      ) {

        childrenIteration({
          parent: child,
          fieldId: newFieldKey,
          groupKeys,

          inheritedVarName,
          inheritedLinkTextVarCall,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
          ignoreMarker: true,
        });
      }

      else if (nodeName === '#text' && child.textContent.replace(/\s+/g, '') !== '') { // if its just text
        newFieldKey += 1;

        if (parent.nodeName === 'A') {
          child.textContent = inheritedLinkTextVarCall;
        } else {
          createTextField({
            parent,
            child,
            fieldKey: newFieldKey,
            fieldsData,
            currentPageIndex,
            nestingLevel: currentNestingLevel,
            callNestingLevel: currentCallNestingLevel,
            inheritedVarName,
            groupKeys,
          });
        }
      }

      else if (nodeName === 'svg') {
        createPhpIcon({
          child,
          nestingLevel: currentNestingLevel,
        })
      }

      else if (nodeName === 'A') {
        newFieldKey += 1;
        currentNestingLevel += 1;

        const { fieldVarName } = createGroupField({
          parent,
          child,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          callNestingLevel: currentCallNestingLevel,
          nestingLevel: currentNestingLevel,
          inheritedVarName,
          groupKeys,
        });

        const newGroupKeys = [...groupKeys, newFieldKey];
        currentCallNestingLevel = currentNestingLevel;
        newFieldKey += 1;

        const { linkTextVarCall } = createLinkField({
          parent,
          child,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          nestingLevel: currentNestingLevel,
          callNestingLevel: currentCallNestingLevel,
          inheritedVarName: fieldVarName,
          groupKeys: newGroupKeys,
        });

        newFieldKey = childrenIteration({
          parent: child,
          fieldId: newFieldKey,
          groupKeys: newGroupKeys,

          inheritedVarName: fieldVarName,
          inheritedLinkTextVarCall: linkTextVarCall,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
        });
      }

      else if (nodeName === 'PICTURE') {
        newFieldKey += 1;

        createPictureField({
          parent,
          child,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          nestingLevel: currentNestingLevel,
          callNestingLevel: currentCallNestingLevel,
          inheritedVarName,
          groupKeys,
          pictureBrickKey,
        });
      }

      else if (nodeName === 'IMG') {
        newFieldKey += 1;

        createImgField({
          parent,
          child,
          fieldKey: newFieldKey,
          fieldsData,
          currentPageIndex,
          nestingLevel: currentNestingLevel,
          callNestingLevel: currentCallNestingLevel,
          inheritedVarName,
          groupKeys,
        });
      }

      else {
        newFieldKey = childrenIteration({
          parent: child,
          section,
          fieldId: newFieldKey,
          inheritedVarName,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
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
        groupSubFields: {},
      });

      const {root, contentBlock, varsBlock } = createVarsRoot({ isSectionVars: true, });
      const sectionInner = $sectionNode.innerHTML;

      $sectionNode.innerHTML = '';
      contentBlock.insertAdjacentHTML('afterbegin', sectionInner);
      $sectionNode.append(root);

      const newFieldKey = childrenIteration({
        parent: $sectionNode,
        section: $sectionNode,
        callNestingLevel: 2,
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

      setTimeout(() => {
        console.log(fieldsData); //!
      }, 100);
    }, 200);
  };

  useEffect(() => {
    let currentKey = Math.floor(Math.random() * (9999999999999 - 1111111111111)) + 1111111111111;

    fieldsData.push(initPageConfig({
      pageTitle: 'About page',
      key: currentKey,
    }));

    currentKey+=1;

    fieldsData.push(createPictureBrick(currentKey));

    setFieldKeyCounter(currentKey);
    setPictureBrickKey(currentKey);
    setPageInitializated(true);
  }, []);

  useEffect(() => {
    if (pageInitializated) {
      if (fieldsData.length && !fieldsData[currentPageIndex].initializated) {
        handleMainInput({ target: { value: defaultInputValue } });
        fieldsData[currentPageIndex].initializated = true;
      }
    }
  }, [pageInitializated])

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
      </div>
    </div>
  );
};

export default ConverterWorkspace;
