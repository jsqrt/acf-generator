import React, { useEffect, useState } from 'react';
import { useRef } from 'react';

const Textarea = ({
  id,
  placeholder,
  defaultValue,
  disabled,
  handleInput,
}) => {
  const [value, setValue] = useState(defaultValue);
  const fakeInput = useRef();

  const onInput = (e) => {
    if (handleInput) handleInput(e);

    const { target } = e;
    const newValue = target.value;

    setValue(newValue);
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    fakeInput.current.scrollTo(0, scrollTop);
  };

  useEffect(() => {
    fakeInput.current.innerHTML = value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#39;")
      .replace(/"/g, "&quot;") // escape symbols before

      .replace(/\w+(?==&#39;|=&quot;)/g, '<mark class="mark mark--attribute">$&</mark>') // match attribute label
      .replace(/(?<==)(&#39;.+&#39;)|(&quot;.+&quot;)/g, '<mark class="mark mark--string">$&</mark>') // match attribute value
      .replace(/(?<=&lt;)\w+/g, '<mark class="mark mark--tag">$&</mark>') // match open tag
      .replace(/(?<=&lt;\/)\w+/g, '<mark class="mark mark--tag">$&</mark>') // match close tag
      .replace(/&lt;\//g, '<mark class="mark mark--symbol">$&</mark>')
      .replace(/&lt;/g, '<mark class="mark mark--symbol">$&</mark>')
      .replace(/&gt;/g, '<mark class="mark mark--symbol">$&</mark>')
      ;
  }, [value]);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  return (
    <div className="textarea">
      <div className="textarea_wrap">
        <label className="textarea_cover" htmlFor={id} ref={fakeInput}>{value}</label>
        <textarea
          name={id}
          id={id}
          placeholder={placeholder}
          className="textarea_in"
          disabled={disabled}
          defaultValue={defaultValue}
          onInput={onInput}
          onScroll={handleScroll}
        />
      </div>
    </div>
  );
};

export default Textarea;