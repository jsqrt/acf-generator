export const initPageConfig = ({
  key,
  pageTitle,
}) => {
  const pageKey = `group_${key}`;
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
    "fields": {},
  };

  return {[key]: pageConfig};
};

export const createFieldConfig = ({
  insertPath,
  label,
  type,
  fieldId,
  defaultValue,
  groupSubFields = {},
  pictureMixinKey,
  sectionLabel,
  suggestedName,
  name,
  fieldNames = {},
  varsInitializated,
  pictureBrickKey,
}) => {

  const fieldKey = `field_${fieldId}`;

  const typeImgConfig = {
    "return_format": "array",
    "preview_size": "medium",
    "library": "all",
    "min_width": "",
    "min_height": "",
    "min_size": "",
    "max_width": "",
    "max_height": "",
    "max_size": "",
    "mime_types": ""
  };

  const typeTabConfig = {
    "placement": "top",
    "endpoint": 0,
  };

  const typeGroupConfig = {
    "layout": "block",
    fieldNames,
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

  const typePictureConfig = {
    "type": "clone",
    "clone": [
      "group_".concat(pictureBrickKey),
    ],
    "display": "group",
    "layout": "block",
    "prefix_label": 0,
    "prefix_name": 0
  };

  // const typeImageConfig = {
  //   "clone": [pictureMixinKey],
  //   "display": "group",
  //   "layout": "block",
  //   "prefix_label": 0,
  //   "prefix_name": 0
  // }

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
    varsInitializated,
    "wrapper": {
      "width": "",
      "class": "",
      "id": "",
    },
  };

  const defineTypeConfig = () => {
    switch (type) {
      case 'img': return typeImgConfig;
      case 'picture': return typePictureConfig;
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

export const createPictureBrick = (key) => {
  const brickKey = `group_${key}`;
  const brickConfig = {
    "key": brickKey,
    "title": "Bricks: Picture",
    "fields": [
      {
        "key": "field_61fab1cb84ca5",
        "label": "Show images for mobile",
        "name": "toggle",
        "type": "true_false",
        "instructions": "",
        "required": 0,
        "conditional_logic": 0,
        "wrapper": {
          "width": "20",
          "class": "",
          "id": ""
        },
        "message": "",
        "default_value": 0,
        "ui": 1,
        "ui_on_text": "",
        "ui_off_text": ""
      },
      {
        "key": "field_61fd4a0af7e97",
        "label": "Screens",
        "name": "screens",
        "type": "group",
        "instructions": "",
        "required": 0,
        "conditional_logic": [
          [
            {
              "field": "field_61fab1cb84ca5",
              "operator": "==",
              "value": "1"
            }
          ]
        ],
        "wrapper": {
          "width": "80",
          "class": "",
          "id": ""
        },
        "layout": "block",
        "sub_fields": [
          {
            "key": "field_61fd4a34f7e98",
            "label": "",
            "name": "min_width",
            "type": "number",
            "instructions": "",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "default_value": 768,
            "placeholder": "",
            "prepend": "min-width",
            "append": "px",
            "min": 320,
            "max": "",
            "step": 1
          },
          {
            "key": "field_61fd4badf7e99",
            "label": "",
            "name": "max_width",
            "type": "number",
            "instructions": "",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "default_value": 767,
            "placeholder": "",
            "prepend": "max-width",
            "append": "px",
            "min": 320,
            "max": "",
            "step": 1
          }
        ]
      },
      {
        "key": "field_61fab32360fae",
        "label": "Desktop",
        "name": "desktop",
        "type": "group",
        "instructions": "",
        "required": 0,
        "conditional_logic": 0,
        "wrapper": {
          "width": "",
          "class": "",
          "id": ""
        },
        "layout": "block",
        "sub_fields": [
          {
            "key": "field_61fa930b1bae7",
            "label": "Image",
            "name": "image",
            "type": "image",
            "instructions": "Standard image format: *.jpg, *.jpeg, *.png, *.gif",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "return_format": "array",
            "preview_size": "thumbnail",
            "library": "all",
            "min_width": "",
            "min_height": "",
            "min_size": "",
            "max_width": "",
            "max_height": "",
            "max_size": "",
            "mime_types": "jpg, jpeg, png, gif"
          },
          {
            "key": "field_61fa93a21bae8",
            "label": "Image WebP",
            "name": "image_webp",
            "type": "image",
            "instructions": "Lossless image format: *.webp",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "return_format": "url",
            "preview_size": "thumbnail",
            "library": "all",
            "min_width": "",
            "min_height": "",
            "min_size": "",
            "max_width": "",
            "max_height": "",
            "max_size": "",
            "mime_types": "webp"
          }
        ]
      },
      {
        "key": "field_61fab2a4e315b",
        "label": "Mobile",
        "name": "mobile",
        "type": "group",
        "instructions": "",
        "required": 0,
        "conditional_logic": [
          [
            {
              "field": "field_61fab1cb84ca5",
              "operator": "==",
              "value": "1"
            }
          ]
        ],
        "wrapper": {
          "width": "",
          "class": "",
          "id": ""
        },
        "layout": "block",
        "sub_fields": [
          {
            "key": "field_61fab00fbd31c",
            "label": "Image",
            "name": "image",
            "type": "image",
            "instructions": "Standard image format: *.jpg, *.jpeg, *.png, *.gif",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "return_format": "array",
            "preview_size": "thumbnail",
            "library": "all",
            "min_width": "",
            "min_height": "",
            "min_size": "",
            "max_width": "",
            "max_height": "",
            "max_size": "",
            "mime_types": "jpg, jpeg, png, gif"
          },
          {
            "key": "field_61fab00fbd31d",
            "label": "Image WebP",
            "name": "image_webp",
            "type": "image",
            "instructions": "Lossless image format: *.webp",
            "required": 0,
            "conditional_logic": 0,
            "wrapper": {
              "width": "50",
              "class": "",
              "id": ""
            },
            "return_format": "url",
            "preview_size": "thumbnail",
            "library": "all",
            "min_width": "",
            "min_height": "",
            "min_size": "",
            "max_width": "",
            "max_height": "",
            "max_size": "",
            "mime_types": "webp"
          }
        ]
      }
    ],
    "location": [
      [
        {
          "param": "post_type",
          "operator": "==",
          "value": "post"
        }
      ]
    ],
    "menu_order": 0,
    "position": "normal",
    "style": "default",
    "label_placement": "top",
    "instruction_placement": "label",
    "hide_on_screen": "",
    "active": false,
    "description": "",
    "show_in_rest": 0,
    "modified": 1643991262,
  };

  return {[`brick_${key}`]: brickConfig};
};