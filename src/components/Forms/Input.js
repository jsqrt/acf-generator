import React from "react";

const Input = ({
  id,
  placeholder,
  type = 'text',
  value,
}) => {
  return (
    <div className="input">
      <input
        value={value}
        placeholder={placeholder}
        type={type}
        className="input__in"
      />
    </div>
  );
};

export default Input;
