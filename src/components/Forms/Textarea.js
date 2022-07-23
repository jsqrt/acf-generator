import React, { useState } from 'react';

const Textarea = ({
  id,
  placeholder,
  defaultValue,
  disabled,
  handleInput,
}) => {

  return (
    <div className="textarea">
      <textarea
        name={id}
        id={id}
        placeholder={placeholder}
        className="textarea_in"
        disabled={disabled}
        defaultValue={defaultValue}
        onInput={handleInput}
      />
    </div>
  );
};

export default Textarea;