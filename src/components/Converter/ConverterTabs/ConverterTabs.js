import React, { useState } from 'react';
import { Textarea } from '../../Forms';

import '../../../scss/components/converter/_converter_tabs.scss';

const ConverterTabs = ({
  tabsArray,
}) => {

  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="converter_tabs">
      {tabsArray && tabsArray.length ? (
        tabsArray.map(({
          value,
          id,
          placeholder,
          disabled,
        }, index) => (
          <div className="converter_tabs__tab" key={id} data-active-tab={index === activeTab}>
            <Textarea
              id={id}
              placeholder={placeholder}
              defaultValue={value}
              disabled={disabled}
            />
          </div>
        ))
      ) : null}
    </div>
  );
};

export default ConverterTabs;