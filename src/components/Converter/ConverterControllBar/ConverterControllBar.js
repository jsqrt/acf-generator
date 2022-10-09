import React, { useContext } from "react";
import { ReactReduxContext } from 'react-redux';

import { ConverterSettings } from "../ConverterSettings";
import { Button } from "../../Button";
import '../../../scss/components/converter/_converter_controll_bar.scss';

const ConverterControllBar = () => {
  const { store } = useContext(ReactReduxContext);

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
    const { fieldsData, currentPageKey } = store.getState();

    const output = concatAllPhpToString(fieldsData[currentPageKey]);

    try {
      await navigator.clipboard.writeText(output);
      window.alert('Copied successfully');
    } catch (err) {
      window.alert(err.message);
    }
  };

  const handelExportPhp = () => {
    store
      .getState()
        .fieldsData
          .forEach((page) => {
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
    const json = JSON.stringify(store.getState().fieldsData);

    const blob = new Blob([json], {type: "application/json"});
    const url  = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = "acf-export.json";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
  };

  const handleRun = () => {

  };

  return (
    <div className="converter_controll_bar">
      <div className="converter_controll_bar__left">
        <div className="converter_controll_bar__field">
          <ConverterSettings />
        </div>
        <div className="converter_controll_bar__field">
          <Button mod="converter_controll_bar__btn converter_controll_bar__btn--style_mod" handleClick={handleRun}>Run</Button>
        </div>
      </div>
      <div className="converter_controll_bar__right">
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
    </div>
  );
};

export default ConverterControllBar;
