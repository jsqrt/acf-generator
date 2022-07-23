import React, { Children } from "react";

const Checkbox = ({
  id,
  children,
  checked,
}) => {
  return (
    <div className="checkbox">
      <input type='checkbox' id={id} className="checkbox__input" hidden checked={checked} />
      <label htmlFor={id} className="checkbox__label">{children}</label>
    </div>
  );
};

export default Checkbox;
