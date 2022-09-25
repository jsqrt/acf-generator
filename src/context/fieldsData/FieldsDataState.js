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
    allowedTypes: {
      pictures: true,
      images: true,
      text: true,
      icons: true,
      links: true,
      buttons: true,
    },
    sectionsPreset: [],
  });

  return (
    <FieldsDataContext.Provider value={{
      fieldsData,
      setFieldsData,
      settings,
      setSettings,
    }}>
      {children}
    </FieldsDataContext.Provider>
  );
};

export default FieldsDataState;