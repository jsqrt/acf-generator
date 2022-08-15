
export const initPageConfig = ({
  updateFieldId,
  pageTitle,
  insertPath,
}) => {
  const randomKey = Math.floor(Math.random() * (9999999999999 - 1111111111111)) + 1111111111111;
  updateFieldId(randomKey);

  const pageKey = `group_${randomKey}`;
  const pageConfig = {
    "key": pageKey,
    "title": pageTitle,
    "location": [
      [
        {
          "param": "page",
          "operator": "==",
          "value": "299",
        },
      ],
    ],
    "menu_order": 0,
    "position": "normal",
    "style": "default",
    "label_placement": "top",
    "instruction_placement": "label",
    "hide_on_screen": "",
    "active": true,
    "description": "",
    "show_in_rest": 0,
    "fields": [],
  };

  return [...insertPath, pageConfig];
};

export const createFieldConfig = ({
  insertPath,
  label,
  type,
  fieldId,
  value,
  groupSubFields,
  pictureMixinKey,
  fieldName,
  sectionLabel,
  suggestedName,
  fieldNames,
  varsInitializated,
}) => {
  const fieldKey = `field_${fieldId}`;

  const typeTabConfig = {
    "placement": "top",
    "endpoint": 0,
  };

  const typeGroupConfig = {
    "layout": "block",
    "sub_fields": groupSubFields,
  };

  const typeWysiwygConfig = {
    "default_value": value,
    "tabs": "all",
    "toolbar": "full",
    "media_upload": 0,
    "delay": 0
  };

  const typeTextareaConfig = {
    "default_value": value,
    "placeholder": "",
    "maxlength": "",
    "rows": 4,
    "new_lines": ""
  };

  const typeImageConfig = {
    "clone": [pictureMixinKey],
    "display": "group",
    "layout": "block",
    "prefix_label": 0,
    "prefix_name": 0
  }

  const fieldConfig = {
    "key": fieldKey,
    "label": label,
    "name": fieldName,
    "type": type,
    "instructions": "",
    "required": 0,
    "conditional_logic": 0,
    sectionLabel,
    suggestedName,
    fieldNames,
    varsInitializated,
    "wrapper": {
      "width": "",
      "class": "",
      "id": "",
    },
  };

  const defineTypeConfig = () => {
    switch (type) {
      case 'image': return typeImageConfig;
      case 'wysiwyg': return typeWysiwygConfig;
      case 'textarea': return typeTextareaConfig;
      case 'group': return typeGroupConfig;
      case 'tab': return typeTabConfig;
      default:
        return {};
    }
  };

  Object.assign(fieldConfig, defineTypeConfig());
  // updateFieldId(fieldId + 1);

  return fieldConfig;
};

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

export const checkPHPVarsInitializated = (sectionObj, section) => {
  if (!sectionObj.varsInitializated) {
    const varsBlockCloseTag = '\n\t?>\n'
    sectionObj.varsInitializated = true;
    section.insertAdjacentHTML('afterbegin', varsBlockCloseTag);
  }
};