import { ConverterControllBar } from './ConverterControllBar';
import { ConverterWorkspace } from './ConverterWorkspace';

import '../../scss/components/converter/_converter.scss';

const Converter = () => {
  return (
    <section className="section converter">
      <div className="section_in converter__in">
        <ConverterControllBar />
        <ConverterWorkspace />
      </div>
    </section>
  )
};

export default Converter;
