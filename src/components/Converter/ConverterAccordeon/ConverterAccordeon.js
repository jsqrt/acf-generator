import React, { useState, useContext } from 'react';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';
import { Textarea } from '../../Forms';

import '../../../scss/components/converter/_converter_accordeon.scss';
import classNames from 'classnames';

const ConverterAccordeon = () => {
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);
  const [activeItem, setActiveItem] = useState(1);
  const [sectionLabel, setSectionLabel] = useState('');

  const currentPageIndex = 0;

  const handleChangeSectionLabel = (e, sectionKey) => {
    const { target } = e;
    const { value } = target;

    fieldsData[currentPageIndex].fields[sectionKey].label = value;
  };

  return (
    <ul className='converter_accordeon'>
      {fieldsData[currentPageIndex] &&
        Object.keys(fieldsData[currentPageIndex].fields).map((sectionKey, index) => {
          const {
            phpOutput,
            id,
            placeholder,
            disabled,
            type,
            sectionLabel,
          } = fieldsData[currentPageIndex].fields[sectionKey];

          const itemClass = classNames('converter_accordeon__item', {
            'converter_accordeon__item--active_state': activeItem === index,
          });

          return type === 'group' && (
            <li className={itemClass} key={`accordeon_item_${index}`}>
              <div className="converter_accordeon__head" onClick={() => setActiveItem(index)}>
                <input
                  className="converter_accordeon__title"
                  key={`accordeon_item_head_title_${sectionLabel}_${index}`}
                  defaultValue={sectionLabel}
                  onInput={(e) => handleChangeSectionLabel(e, sectionKey)}
                />
                <button type='button' label='Remove section'></button>
                <button type='button' label='Ignore for ACF-Config'></button>
              </div>
              <div className="converter_accordeon__dropdown">
                <Textarea
                  id={id}
                  placeholder={placeholder}
                  defaultValue={phpOutput}
                  disabled={disabled}
                  key={`${phpOutput}${index}`}
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