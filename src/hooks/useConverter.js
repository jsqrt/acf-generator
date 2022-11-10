import React, { useContext, useEffect, useState } from 'react';
import produce from 'immer';

import {
  checkNodeContainsIgnoreClasses,
  toUpperFirstLetter,
  checkNestingText,
  getTabChar,
  createPhpIcon,
} from '../utils';

import {
  createFieldConfig,
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
import { removeAllRoots } from '../utils/converterUtils';
import { ReactReduxContext } from 'react-redux';


const useConverter = ({
  defaultInputValue,
}) => {
  const [mainInputValue, setMainInputValue] = useState(defaultInputValue);
  const { store } = useContext(ReactReduxContext);

  const childrenIteration = (args) => {
    const {
      parent,
      inheritedVarName,
      groupKeys,
      inheritedLinkTextVarCall,

      fieldId = groupKeys[0],
      inheritedNestingLevel = 0,
      inheritedCallNestingLevel = 2,
      ignoreMarker = false,
      settings,
      // currentPageKey,
      // fieldsData,
    } = args;
    let fieldsData = args.fieldsData;

    let children = Array.from(parent.childNodes);
    let newFieldKey = fieldId; // 👌

    if (!children.length) return newFieldKey;

    if (
      parent.classList.contains('_root')
    ) {
      childrenIteration({
        ...args,
        parent: parent.querySelector('._content'),
        fieldsData,
      });

      return newFieldKey;
    }

    if (settings.allowedTypes.text) {
      children = checkNestingText(parent, children, ignoreMarker);
    }

    children.forEach((child, childIndex) => {
      let currentNestingLevel = inheritedNestingLevel + 1;
      let currentCallNestingLevel = inheritedCallNestingLevel;
      const { nodeName } = child;
      args.child = child;

      if (
        nodeName === 'UL'
        || nodeName === 'OL'
        || nodeName === 'LI'
        || checkNodeContainsIgnoreClasses(child, settings.ignoreClasses)
        || ignoreMarker
      ) {

        childrenIteration({
          ...args,
          parent: child,
          fieldId: newFieldKey,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
          ignoreMarker: true,
          fieldsData,
        });
      }

      else if (nodeName === '#text' && child.textContent.replace(/\s+/g, '') !== '') { // if its just text
        newFieldKey += 1;

        if (parent.nodeName === 'A' && inheritedLinkTextVarCall) {
          child.textContent = inheritedLinkTextVarCall;
        } else if (settings.allowedTypes.text) {
          createTextField({
            ...args,
            fieldKey: newFieldKey,
            nestingLevel: currentNestingLevel,
            callNestingLevel: currentCallNestingLevel,
            store,
          });

          fieldsData = store.getState().fieldsData;
        }
      }
      else if (nodeName === 'svg' && settings.allowedTypes.icons) {
        createPhpIcon({
          child,
          nestingLevel: currentNestingLevel,
          store,
        });

        fieldsData = store.getState().fieldsData;
      }

      else if (nodeName === 'A') {
        newFieldKey += 1;
        currentNestingLevel += 1;
        let newGroupKeys;
        let varName;
        let textVarCall;

        if (settings.allowedTypes.links) {
          const { fieldVarName } = createGroupField({
            ...args,
            fieldKey: newFieldKey,
            callNestingLevel: currentCallNestingLevel,
            nestingLevel: currentNestingLevel,
            store,
            fieldsData,
          });

          varName = fieldVarName;

          newGroupKeys = [...groupKeys, newFieldKey];
          currentCallNestingLevel = currentNestingLevel;
          newFieldKey += 1;

          fieldsData = store.getState().fieldsData;

          const { linkTextVarCall } = createLinkField({
            ...args,
            fieldKey: newFieldKey,
            nestingLevel: currentNestingLevel,
            callNestingLevel: currentCallNestingLevel,
            inheritedVarName: fieldVarName,
            groupKeys: newGroupKeys,
            fieldsData,
            store,
          });

          textVarCall = linkTextVarCall;

          fieldsData = store.getState().fieldsData;
        }

        newFieldKey = childrenIteration({
          ...args,

          parent: child,
          fieldId: newFieldKey,
          groupKeys: newGroupKeys || groupKeys,

          inheritedVarName: varName || inheritedVarName,
          inheritedLinkTextVarCall: textVarCall || inheritedLinkTextVarCall,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
          fieldsData,
        });
      }

      else if (nodeName === 'PICTURE') {
        if (settings.allowedTypes.pictures) {
          newFieldKey += 1;
          createPictureField({
            ...args,
            fieldKey: newFieldKey,
            nestingLevel: currentNestingLevel,
            callNestingLevel: currentCallNestingLevel,
            pictureBrickKey: store.getState().pictureBrickFieldKey,
            store,
          });
          fieldsData = store.getState().fieldsData;
        }
      }

      else if (nodeName === 'IMG' && settings.allowedTypes.images) {
        newFieldKey += 1;

        createImgField({
          ...args,
          fieldKey: newFieldKey,
          nestingLevel: currentNestingLevel,
          callNestingLevel: currentCallNestingLevel,
          store,
        });

        fieldsData = store.getState().fieldsData;
      }

      else {
        newFieldKey = childrenIteration({
          ...args,
          parent: child,
          fieldId: newFieldKey,
          inheritedNestingLevel: currentNestingLevel,
          inheritedCallNestingLevel: currentCallNestingLevel,
          fieldsData,
        });
      }

      child.before(`\n${getTabChar(currentNestingLevel)}`);
      if (childIndex === children.length - 1) child.after(`\n${getTabChar(currentNestingLevel - 1)}`);
    });

    return newFieldKey;
  };

  const separateSections = async ($sectionsNodes) => {
    let {
      fieldKeyCounter,
      fieldsData,
      currentPageKey,
      settings,
    } = await store.getState();

    let currentFieldKey = fieldKeyCounter + 1;

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

      if (settings.sectionsPreset[currentFieldKey + 1]) {
        sectionSuggestedName = settings.sectionsPreset[currentFieldKey + 1].sectionLabel;
        sectionLabel = settings.sectionsPreset[currentFieldKey + 1].sectionLabel;
      } else {
        if (classList[0]) {
          sectionSuggestedName = classList[0]; // match first valid class
          sectionLabel = toUpperFirstLetter(sectionSuggestedName); // get section name
        } else {
          sectionSuggestedName = `section_${index + 1}`;
          sectionLabel = `Section ${index + 1}`;
        }
      }

      fieldsData = produce(fieldsData, draft => {
        draft[currentPageKey].fields[currentFieldKey] = createFieldConfig({
          type: 'tab',
          label: sectionLabel,
          fieldId: currentFieldKey,
          suggestedName: sectionSuggestedName,
        });
      });

      fieldsData = produce(fieldsData, draft => {
        draft[currentPageKey].fields[currentFieldKey + 1] = createFieldConfig({
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
      });

      store.dispatch({
        type: 'UPDATE_FIELDS_DATA',
        value: fieldsData,
      });

      const {root, contentBlock } = createVarsRoot({ isSectionVars: true, });
      const sectionInner = $sectionNode.innerHTML;

      $sectionNode.innerHTML = '';
      contentBlock.insertAdjacentHTML('afterbegin', sectionInner);
      $sectionNode.append(root);

      const newFieldKey = childrenIteration({
        parent: $sectionNode,
        section: $sectionNode,
        callNestingLevel: 2,
        groupKeys: [currentFieldKey + 1],
        currentPageKey,
        fieldsData,
        settings,
      });

      removeAllRoots($sectionNode);

      const phpOutput = $sectionNode
        .outerHTML
          .replace(/&lt;/gi, '<')
          .replace(/&gt;/gi, '>')
          .replace(/-->/gi, '')
          .replace(/!--/gi, '');

      fieldsData = store.getState().fieldsData;
      fieldsData = produce(fieldsData, draft => {
        draft[currentPageKey].fields[currentFieldKey + 1].phpOutput = phpOutput;
      });

      store.dispatch({
        type: 'UPDATE_FIELDS_DATA',
        value: fieldsData,
      });

      currentFieldKey = newFieldKey + 1;

      setTimeout(() => {
        console.log(store.getState()); //!
      }, 3000);
    });

    store.dispatch({
      type: 'SET_FIELD_KEY_COUNTER',
      value: currentFieldKey,
    });
  };

  let compileDebouce;

  const debounce = (cb) => {
    clearTimeout(compileDebouce);
    compileDebouce = setTimeout(() => {
      cb();
    }, 200);
  };

  const compile = (value) => debounce(() => {
    setMainInputValue(value);

    store.dispatch({
      type: 'CLEAN_PAGE_FIELDS',
    });

    if (value === '') return;

    const DOM = document.createElement('div');
    DOM.innerHTML = value;

    const $sectionsNodes = DOM.querySelectorAll('section');

    separateSections($sectionsNodes);
  });

  useEffect(() => {
    store.dispatch({
      type: 'CREATE_PAGE_FIELD',
    });

    store.dispatch({
      type: 'CREATE_PICTURE_BRICK_FIELD',
    });

    store.dispatch({
      type: 'SET_FIELD_KEY_COUNTER',
    });

    compile(mainInputValue || defaultInputValue);
  }, []);

  return {
    compile,
    mainInputValue,
  }
};

export default useConverter;