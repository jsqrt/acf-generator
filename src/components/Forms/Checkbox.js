import React, { Children } from 'react';

const Checkbox = ({
	id,
	children,
	checked,
	handleChange,
}) => {
	return (
		<div className="checkbox">
			<input
				type="checkbox"
				id={id}
				className="checkbox__input"
				hidden
				defaultChecked={checked}
				onChange={handleChange}
			/>
			<label
				htmlFor={id}
				className="checkbox__label"
			>
				{children}
			</label>
		</div>
	);
};

export default Checkbox;
