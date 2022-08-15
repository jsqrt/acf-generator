import React from 'react';
import { useState } from 'react';
import FieldsDataContext from './FieldsDataContext';

const FieldsDataState = ({ children }) => {
  const [fieldsData, setFieldsData] = useState([]);

  return (
    <FieldsDataContext.Provider value={{ fieldsData, setFieldsData }}>
      {children}
    </FieldsDataContext.Provider>
  );
};

export default FieldsDataState;