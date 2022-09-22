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
        id: 'settings_drop_1_check_1',
        label: 'Images',
        checked: true,
      },
      {
        id: 'settings_drop_1_check_2',
        label: 'Text contents',
      },
      {
        id: 'settings_drop_1_check_3',
        label: 'Links & buttons',
      },
      {
        id: 'settings_drop_1_check_4',
        label: 'Field groups',
      },
    ],
    inputs: [
      {
        id: 'settings_drop_1_input_1',
        label: 'Ignore classnames:',
        placeholder: 'Fields name prefix',
        defaultValue: settings.ignoreClasses.join(','),
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
