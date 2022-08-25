import React, { useContext } from "react";
import { ConverterSettings } from "../ConverterSettings";
import { Button } from "../../Button";
import '../../../scss/components/converter/_converter_controll_bar.scss';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';
import { createFieldConfig } from "../utils";

const ConverterControllBar = () => {
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);

  const handleCopyToClipboard = () => {
    console.clear();
  };

  const handleExportConfig = () => {
    const json = JSON.stringify(fieldsData);

    const blob = new Blob([json], {type: "application/json"});
    const url  = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href        = url;
    a.download    = "acf-export.json";

    document.body.appendChild(a);
    a.click();

    console.log(fieldsData); //!
    document.body.removeChild(a);
  };


  return (
    <div className="converter_controll_bar">
      <div className="converter_controll_bar__field converter_controll_bar__field--ofset_mod">
       <ConverterSettings />
      </div>
      <div className="converter_controll_bar__field">
        <Button mod="converter_controll_bar__btn" handleClick={handleCopyToClipboard}>Copy to clipboard</Button>
      </div>
      <div className="converter_controll_bar__field">
        <Button mod="converter_controll_bar__btn" handleClick={handleExportConfig}>Export ACF config</Button>
      </div>
    </div>
  );
};

export default ConverterControllBar;
