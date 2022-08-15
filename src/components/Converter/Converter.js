import { ConverterControllBar } from './ConverterControllBar';
import { ConverterWorkspace } from './ConverterWorkspace';
import { FieldsDataState } from '../../context/fieldsData';

import '../../scss/components/converter/_converter.scss';

const Converter = () => {
  return (
    <section className="section converter">
      <div className="section_in converter__in">
        <FieldsDataState>
          <ConverterControllBar />
          <ConverterWorkspace />
        </FieldsDataState>
      </div>
    </section>
  )
};

export default Converter;
