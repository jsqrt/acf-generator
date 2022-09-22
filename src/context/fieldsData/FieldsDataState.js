import React from 'react';
import { useState } from 'react';
import FieldsDataContext from './FieldsDataContext';

const FieldsDataState = ({ children }) => {
  const [fieldsData, setFieldsData] = useState([]);
  const [settings, setSettings] = useState({
    ignoreClasses: [
      'list',
      'swiper-wrapper',
      'item',
      'slider',
    ],
  });

  return (
    <FieldsDataContext.Provider value={{
      fieldsData,
      setFieldsData,
      settings,
    }}>
      {children}
    </FieldsDataContext.Provider>
  );
};

export default FieldsDataState;