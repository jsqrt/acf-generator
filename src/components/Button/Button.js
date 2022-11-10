import React from 'react';

const Button = ({
	handleClick = undefined,
	title = undefined,
	mod = '',
	children,
}) => {
	const className = `buttton ${mod}`;

	return (
		<button
			className={className}
			type="button"
			onClick={handleClick}
		>
			{children}
		</button>
	);
};

export default Button;
