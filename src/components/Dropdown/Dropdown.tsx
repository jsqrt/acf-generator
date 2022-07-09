import React from "react";
import { Input, Checkbox } from "../Forms";
import '../../scss/components/_dropdown.scss';

const Dropdown = ({
  checkboxes,
  inputs,
}) => {

  return (
    <div className="dropdown">
      <ul className="dropdown__checkboxes">
        {checkboxes && checkboxes.length ? checkboxes.map(({
          id,
          label,
        }) => {
          return (
            <li className="dropdown__checkbox" key={id}>
              <Checkbox id={id}>
                {label}
              </Checkbox>
            </li>
          );
        }) : null}
      </ul>
      <ul className="dropdown__inputs">
        {inputs && inputs.length ? inputs.map(({
          id,
          placeholder
        }) => {
          return (
            <li className="dropdown__input" key={id}>
              <Input placeholder={placeholder} />
            </li>
          );
        }) : null}
      </ul>
    </div>
  );
};

export default Dropdown;
