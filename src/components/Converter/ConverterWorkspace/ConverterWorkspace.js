import React from 'react';

import { Textarea } from '../../Forms';
import { ConverterAccordeon } from '../ConverterAccordeon';
import '../../../scss/components/converter/_converter_workspace.scss';

const ConverterWorkspace = ({
  defaultInputValue,
  handleMainInput,
}) => {

  return (
    <div className='converter_workspace'>
      <div className="converter_workspace__col">
        <Textarea
          id="main_input"
          defaultValue={defaultInputValue}
          handleInput={handleMainInput}
          placeholder='Insert your page here'
        />
      </div>
      <div className="converter_workspace__col">
        <ConverterAccordeon />
      </div>
    </div>
  );
};

export default ConverterWorkspace;
