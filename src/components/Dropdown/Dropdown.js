import React from 'react';
import classNames from 'classnames';
import { Input, Checkbox } from '../Forms';
import '../../scss/components/_dropdown.scss';

const Dropdown = ({
	checkboxes,
	inputs,
	isActive,
}) => {
	const className = classNames('dropdown', {
		'dropdown--active_state': isActive,
	});

	return (
		<div className={className}>
			<ul className="dropdown__checkboxes">
				{checkboxes && checkboxes.length ? checkboxes.map(({
					id,
					label,
					checked,
					handleChange,
				}) => {
					return (
						<li className="dropdown__checkbox" key={id}>
							<Checkbox id={id} checked={checked} handleChange={handleChange}>
								{label}
							</Checkbox>
						</li>
					);
				}) : null}
			</ul>
			<ul className="dropdown__inputs">
				{inputs && inputs.length ? inputs.map(({
					id,
					placeholder,
					label,
					defaultValue,
					handleInput,
				}) => {
					return (
						<li className="dropdown__input" key={id}>
							<Input
								placeholder={placeholder}
								id={id}
								label={label}
								defaultValue={defaultValue}
								handleInput={handleInput}
							/>
						</li>
					);
				}) : null}
			</ul>
		</div>
	);
};

export default Dropdown;
