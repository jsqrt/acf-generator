import React, { useState } from 'react';
import { Textarea } from '../../Forms';
import { ConverterAccordeon } from '../ConverterAccordeon';

import '../../../scss/components/converter/_converter_tabs.scss';

const ConverterTabs = ({
  tabsArray,
  sectionsData,
}) => {

  const [activeTab, setActiveTab] = useState(0);
  const currentPageIndex = 0;

  return (
    <div className="converter_tabs">
      {tabsArray && tabsArray.length && sectionsData.length ? (
        tabsArray.map(({
          value,
          placeholder,
          disabled,
          id,
          accordeon,
        }, index) => {
          if (index === 1) return null;


          const sectionsList = sectionsData[currentPageIndex].fields; // брать данные из контекста

          if (accordeon && Object.values(sectionsList).length) {
            return (
              <ConverterAccordeon list={Object.values(sectionsList)} key={`accordeon_${index}`} />
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
        })
      ) : null}
    </div>
  );
};

export default ConverterTabs;