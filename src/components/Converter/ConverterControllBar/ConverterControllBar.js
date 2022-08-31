import React, { useContext } from "react";
import { ConverterSettings } from "../ConverterSettings";
import { Button } from "../../Button";
import '../../../scss/components/converter/_converter_controll_bar.scss';
import FieldsDataContext from '../../../context/fieldsData/FieldsDataContext';
import { createFieldConfig } from "../utils";

const ConverterControllBar = () => {
	const { fieldsData, setFieldsData } = useContext(FieldsDataContext);
  const currentPageIndex = 0;


  const concatAllPhpToString = (page) => {
    const output = [];

    if (page.fields && Object.values(page.fields).length) {
      Object.values(page.fields).forEach((section) => {
        if (section.phpOutput) output.push(section.phpOutput);
      });

      return output.join('\n\n');
    }

    return null;
  };

  const handleCopyToClipboard = async () => {
    const output = concatAllPhpToString(fieldsData[currentPageIndex]);

    try {
      await navigator.clipboard.writeText(output);
      window.alert('Copied successfully');
    } catch (err) {
      window.alert(err.message);
    }

    console.clear();
  };

  const handelExportPhp = () => {
    fieldsData.forEach((page) => {

      const output = concatAllPhpToString(page);

      if (output) {
        const blob = new Blob([output], {type: "text/html"});
        const url  = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${page.title}.php`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
      }
    });
  };

  const handleExportConfig = () => {
    const json = JSON.stringify(fieldsData);

    const blob = new Blob([json], {type: "application/json"});
    const url  = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "acf-export.json";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  };


  return (
    <div className="converter_controll_bar">
      <div className="converter_controll_bar__field converter_controll_bar__field--ofset_mod">
       <ConverterSettings />
      </div>
      <div className="converter_controll_bar__field">
        <Button mod="converter_controll_bar__btn" handleClick={handleCopyToClipboard}>Copy page PHP to clipboard</Button>
      </div>
      <div className="converter_controll_bar__field">
        <Button mod="converter_controll_bar__btn" handleClick={handelExportPhp}>Export PHP file</Button>
      </div>
      <div className="converter_controll_bar__field">
        <Button mod="converter_controll_bar__btn" handleClick={handleExportConfig}>Export ACF config</Button>
      </div>
    </div>
  );
};

export default ConverterControllBar;
