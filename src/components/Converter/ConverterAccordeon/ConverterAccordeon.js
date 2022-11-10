/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
	useState,
	useContext,
	useEffect,
} from 'react';
import { ReactReduxContext } from 'react-redux';
import classNames from 'classnames';
import { Textarea } from '../../Forms';

import '../../../scss/components/converter/_converter_accordeon.scss';

const ConverterAccordeon = () => {
	const { store } = useContext(ReactReduxContext);

	const [activeItem, setActiveItem] = useState(1);
	const [fieldsData, setFieldsData] = useState(store.getState().fieldsData);
	const [currentPageKey, setCurrentPageKey] = useState(store.getState().currentPageKey);

	const handleChangeSectionLabel = (e, sectionKey) => {
		const { target } = e;
		const { value } = target;

		store.dispatch({
			type: 'ADD_PRESET_SECTION_LABEL',
			value,
			key: sectionKey,
		});
	};

	useEffect(() => {
		store.subscribe(() => {
			const { fieldsData: data, currentPageKey: pageKey } = store.getState();
			setFieldsData(data);
			setCurrentPageKey(pageKey);
		});
	});

	return (
		<ul className="converter_accordeon">
			{fieldsData[currentPageKey] && Object.keys(fieldsData[currentPageKey]?.fields).map((sectionKey, index) => {
				const {
					phpOutput,
					id,
					placeholder,
					disabled,
					type,
					sectionLabel,
				} = fieldsData[currentPageKey].fields[sectionKey];

				const itemClass = classNames('converter_accordeon__item', {
					'converter_accordeon__item--active_state': activeItem === index,
				});

				return type === 'group' && (
					<li className={itemClass} key={`accordeon_item_${index}`}>
						<div className="converter_accordeon__head" onClick={() => setActiveItem(index)}>
							<input
								className="converter_accordeon__title"
								key={`accordeon_item_head_title_${sectionLabel}_${index}`}
								defaultValue={sectionLabel}
								onBlur={(e) => handleChangeSectionLabel(e, sectionKey)}
								disabled
							/>
							<button type="button" label="Remove section" />
							<button type="button" label="Ignore for ACF-Config" />
						</div>
						<div className="converter_accordeon__dropdown">
							<Textarea
								id={id}
								placeholder={placeholder}
								defaultValue={phpOutput}
								disabled={disabled}
								key={`${phpOutput}${index}`}
							/>
						</div>
					</li>
				);
			})}
		</ul>
	);
};

export default ConverterAccordeon;
