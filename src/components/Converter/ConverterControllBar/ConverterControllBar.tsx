import React from "react";
import { ConverterSettings } from "../ConverterSettings";
import { Button } from "../../Button";
import '../../../scss/components/converter/_converter_controll_bar.scss';

const ConverterControllBar = () => {

  const handleCopyToClipboard = () => {

  };

  const handleExportConfig = () => {

  };

  return (
    <div className="converter_controll_bar">
      <div className="converter_controll_bar__field">
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
