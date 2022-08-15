import React, { useContext, useState } from 'react';
import { Textarea } from '../../Forms';
import { ConverterAccordeon } from '../ConverterAccordeon';

import '../../../scss/components/converter/_converter_tabs.scss';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';

const ConverterTabs = ({
  tabsArray,
}) => {
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);
  const [activeTab, setActiveTab] = useState(0);
  const currentPageIndex = 0;

  return (
    <div className="converter_tabs">
      {
        tabsArray
        && tabsArray.length
        && fieldsData
        && fieldsData.length
        && (
          tabsArray.map(({
            value,
            placeholder,
            disabled,
            id,
            accordeon,
          }, index) => {
            if (index === 1) return null;
            if (!fieldsData[currentPageIndex]) return null;

            const sectionsList = fieldsData[currentPageIndex].fields; // брать данные из контекста

            if (accordeon && Object.values(sectionsList).length) {
              return (
                <ConverterAccordeon
                  sectionsData={fieldsData[currentPageIndex].fields}
                  key={`accordeon_${index}`}
                  index={index}
                />
              )
            }

            // return (
            //   <div className="converter_tabs__tab" key={id} data-active-tab={index === activeTab}>
            //     <Textarea
            //       id={id}
            //       placeholder={placeholder}
            //       defaultValue={value}
            //       disabled={disabled}
            //     />
            //   </div>
            // );
            return null;
          })
        )
      }
    </div>
  );
};

export default ConverterTabs;