import React from "react";

const Input = ({
  id,
  placeholder,
  type = 'text',
  value,
  label,
  defaultValue,
}) => {
  return (
    <div className="input">
      {label && (
        <label htmlFor={id} className="input__label">{label}</label>
      )}
      <input
        value={value}
        placeholder={placeholder}
        type={type}
        defaultValue={defaultValue}
        id={id}
        className="input__in"
      />
    </div>
  );
};

export default Input;
