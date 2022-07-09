import { ConverterControllBar } from './ConverterControllBar';
import '../../scss/components/converter/_converter.scss';

const Converter = () => {
  return (
    <section className="section converter">
      <div className="section_in converter__in">
        <ConverterControllBar />
      </div>
    </section>
  )
};

export default Converter;
