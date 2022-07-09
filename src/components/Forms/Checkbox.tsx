import React, { Children } from "react";

const Checkbox = ({
  id,
  children,
}) => {
  return (
    <div className="checkbox">
      <label htmlFor={id} className="checkbox__label">{children}</label>
      <input type='checkbox' id={id} className="checkbox__input" hidden={true} />
    </div>
  );
};

export default Checkbox;
