import React from 'react';
import { Textarea } from '../../Forms';

import '../../../scss/components/converter/_converter_accordeon.scss';
import { useState } from 'react';
import classNames from 'classnames';

const ConverterAccordeon = ({
  list,
  index
}) => {

  const [activeItem, setActiveItem] = useState(0);

  return (
    <ul className='converter_accordeon'>
      {
        list.map(({
          phpOutput,
          id,
          placeholder,
          disabled,
        }, subIndex) => {

          const itemClass = classNames('converter_accordeon__item', {
            'converter_accordeon__item--active_state': activeItem === subIndex,
          });

          return (
            <li className={itemClass} key={`accordeon_item_${index}_${subIndex}`}>
              <div className="converter_accordeon__head" onClick={() => setActiveItem(subIndex)}>
                <div className="converter_accordeon__title">Test</div>
              </div>
              <div className="converter_accordeon__dropdown">
                <Textarea
                  id={id}
                  placeholder={placeholder}
                  defaultValue={phpOutput}
                  disabled={disabled}
                />
              </div>
            </li>
          );
        })
      }
    </ul>
  );
};

export default ConverterAccordeon;