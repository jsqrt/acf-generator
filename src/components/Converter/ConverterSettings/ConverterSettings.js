import React, { useState, useContext } from "react";
import { Button } from "../../Button";
import { Dropdown } from "../../Dropdown";
import '../../../scss/components/converter/_converter_settings.scss';
import FieldsDataContext from "../../../context/fieldsData/FieldsDataContext";

const ConverterSettings = () => {
	const { settings, setSettings } = useContext(FieldsDataContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        handleChange: () => settings.allowedTypes.pictures = !settings.allowedTypes.pictures,
      },
      {
        id: 'settings_drop_1_check_1',
        label: 'Images',
        checked: settings.allowedTypes.images,
        handleChange: () => settings.allowedTypes.images = !settings.allowedTypes.images,
      },
      {
        id: 'settings_drop_1_check_2',
        label: 'Text contents',
        checked: settings.allowedTypes.text,
        handleChange: () => settings.allowedTypes.text = !settings.allowedTypes.text,
      },
      {
        id: 'settings_drop_1_check_3',
        label: 'Links',
        checked: settings.allowedTypes.links,
        handleChange: () => settings.allowedTypes.links = !settings.allowedTypes.links,
      },
      {
        id: 'settings_drop_1_check_4',
        label: 'Buttons',
        checked: settings.allowedTypes.buttons,
        handleChange: () => settings.allowedTypes.buttons = !settings.allowedTypes.buttons,
      },
      {
        id: 'settings_drop_1_check_5',
        label: 'Icons',
        checked: settings.allowedTypes.icons,
        handleChange: () => settings.allowedTypes.icons = !settings.allowedTypes.icons,
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
          settings.ignoreClasses = value.split(',').map((el) => {
            if (el !== '' & el !== ' ') {
              return el.replace(/[\s.]/g, '');
            }
          }).filter((el) => !!el);
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
