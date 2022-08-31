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
  defaultValue,
  groupSubFields,
  pictureMixinKey,
  sectionLabel,
  suggestedName,
  name,
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
    "default_value": defaultValue,
    "tabs": "all",
    "toolbar": "full",
    "media_upload": 0,
    "delay": 0
  };

  const typeTextareaConfig = {
    "default_value": defaultValue,
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
    "instructions": "",
    "required": 0,
    "conditional_logic": 0,
    type,
    label,
    name,
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