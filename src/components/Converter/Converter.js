import React from 'react';
import { ConverterControllBar } from './ConverterControllBar';
import { ConverterWorkspace } from './ConverterWorkspace';

import '../../scss/components/converter/_converter.scss';
import { useConverter } from '../../hooks';

const Converter = () => {
  const defaultInputValue = ``;

  const {compile, mainInputValue} = useConverter({
    defaultInputValue,
  });

  const handleMainInput = (e) => {
    const { target } = e;
    const { value } = target;
    compile(value);
  };

  return (
    <section className="section converter">
      <div className="section_in converter__in">
        <ConverterControllBar
          handleCompile={compile}
          mainInputValue={mainInputValue}
        />
        <ConverterWorkspace
          defaultInputValue={defaultInputValue}
          handleMainInput={handleMainInput}
        />
      </div>
    </section>
  )
};

export default Converter;
