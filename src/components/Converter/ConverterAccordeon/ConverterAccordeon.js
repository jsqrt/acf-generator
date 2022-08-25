import React, { useEffect, useState } from 'react';
import { Textarea } from '../../Forms';

import '../../../scss/components/converter/_converter_accordeon.scss';
import classNames from 'classnames';

const ConverterAccordeon = ({
  index,
  sectionsData,
  changeSectionsData,
}) => {
  const [activeItem, setActiveItem] = useState(1);
  const [sectionLabel, setSectionLabel] = useState('');

  const handleChangeSectionLabel = (e, sectionKey) => {
    const { target } = e;
    const { value } = target;

    sectionsData[sectionKey].label = value;
  };

  return (
    <ul className='converter_accordeon'>
      {
        Object.keys(sectionsData).map((sectionKey, subIndex) => {
          const {
            phpOutput,
            id,
            placeholder,
            disabled,
            type,
            sectionLabel,
          } = sectionsData[sectionKey];

          const itemClass = classNames('converter_accordeon__item', {
            'converter_accordeon__item--active_state': activeItem === subIndex,
          });

          return type === 'group' && (
            <li className={itemClass} key={`accordeon_item_${index}_${subIndex}`}>
              <div className="converter_accordeon__head" onClick={() => setActiveItem(subIndex)}>
                <input
                  className="converter_accordeon__title"
                  key={`accordeon_item_head_title_${sectionLabel}_${index}_${subIndex}`}
                  defaultValue={sectionLabel}
                  onInput={(e) => handleChangeSectionLabel(e, sectionKey)}
                />
              </div>
              <div className="converter_accordeon__dropdown">
                <Textarea
                  id={id}
                  placeholder={placeholder}
                  defaultValue={phpOutput}
                  disabled={disabled}
                  key={`${phpOutput}${subIndex}`}
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