import React, { useState, useContext } from "react";
import { Button } from "../../Button";
import { Dropdown } from "../../Dropdown";
import '../../../scss/components/converter/_converter_settings.scss';
import FieldsDataContext from "../../../context/fieldsData/FieldsDataContext";
import { ReactReduxContext } from 'react-redux';

const ConverterSettings = () => {
	// const { settings, setSettings } = useContext(FieldsDataContext);
  const { store } = useContext(ReactReduxContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { settings } = store.getState();

  const handleToggleDropdown = (e) => {
    e.preventDefault();
    setDropdownOpen(!dropdownOpen)
  };

  const dropdown = {
    checkboxes: [
      {
        id: 'settings_drop_1_check_0',
        label: 'Pictures',
        checked: settings.allowedTypes.pictures,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'pictures',
          });
        },
      },
      {
        id: 'settings_drop_1_check_1',
        label: 'Images',
        checked: settings.allowedTypes.images,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'images',
          });
        },
      },
      {
        id: 'settings_drop_1_check_2',
        label: 'Text contents',
        checked: settings.allowedTypes.text,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'text',
          });
        },
      },
      {
        id: 'settings_drop_1_check_3',
        label: 'Links',
        checked: settings.allowedTypes.links,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'links',
          });
        },
      },
      {
        id: 'settings_drop_1_check_4',
        label: 'Buttons',
        checked: settings.allowedTypes.buttons,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'buttons',
          });
        },
      },
      {
        id: 'settings_drop_1_check_5',
        label: 'Icons',
        checked: settings.allowedTypes.icons,
        handleChange: () => {
          store.dispatch({
            type: 'REVERSE_ALLOWED_TYPE',
            key: 'icons',
          });
        },
      },
    ],
    inputs: [
      {
        id: 'settings_drop_1_input_1',
        label: 'Ignore if classname contain:',
        placeholder: 'Fields name prefix',
        defaultValue: settings.ignoreClasses.join(','),
        handleInput: (e) => {
          const { value } = e.target;
          store.dispatch({
            type: 'UPDATE_IGNORE_CLASSNAMES',
            value: value
              .split(',')
                .map((el) => {
                  if (el !== '' & el !== ' ') {
                    return el.replace(/[\s.]/g, '');
                  }
                })
                  .filter((el) => !!el),
          });
        }
      }
    ],
  }

  return (
    <div className="converter_controll_bar_setting">
      <Button
        mod="converter_controll_bar_setting__btn"
        handleClick={handleToggleDropdown}
      >
        Settings
      </Button>
      <Dropdown
        checkboxes={dropdown.checkboxes}
        inputs={dropdown.inputs}
        isActive={dropdownOpen}
      />
    </div>
  );
};

export default ConverterSettings;
