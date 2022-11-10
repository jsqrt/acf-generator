export const checkNodeContainsIgnoreClasses = (node, ignoreNodeClassNames) => {
	return (node.classList && Array.from(node.classList)
		.filter((str) => ignoreNodeClassNames
			.filter((ignore) => str
				.includes(ignore))
			.length > 0)
		.length > 0);
};

export const defineTextFieldLabel = (parent) => {
	let fieldName = 'text';

	Array.from(parent.classList).forEach((str) => {
		if (str.includes('subtitle')) fieldName = 'subtitle';
		else if (str.includes('title')) fieldName = 'title';
		else if (str.includes('descr')) fieldName = 'descr';
		else if (str.includes('text')) fieldName = 'text';
		else if (str.includes('name')) fieldName = 'name';
		else if (str.includes('position')) fieldName = 'position';
		else if (str.includes('label')) fieldName = 'label';
		else if (str.includes('value')) fieldName = 'value';

		else if (
			str.includes('button')
			|| str.includes('btn')
			|| str.includes('trigger')
			|| str.includes('more')
			|| str.includes('back')
			|| parent.nodeName === 'BUTTON'
		) fieldName = 'button_title';
	});

	return fieldName;
};

export const defineImgFieldLabel = (target, child) => {
	let fieldName = 'image';

	Array.from(target.classList).forEach((str) => {
		if (str.includes('decor')) fieldName = 'decor';
		if (str.includes('logo')) fieldName = 'logo';
		if (str.includes('icon')) fieldName = 'icon';
		if (str.includes('bg')) fieldName = 'background';
	});

	return fieldName;
};

// export const checkPHPVarsInitializated = (sectionObj, section) => {
//   // if (!sectionObj.varsInitializated) {
//   //   const varsBlockCloseTag = '\n\t?>\n'
//   //   sectionObj.varsInitializated = true;
//   //   section.insertAdjacentHTML('afterbegin', varsBlockCloseTag);
//   // }
// };

export const toUpperFirstLetter = (str) => {
	const stringArray = str.split('');
	stringArray[0] = stringArray[0].toUpperCase();
	return stringArray.join('').replace(/_/g, ' ');
};

export const getTabChar = (n) => {
	return '\t'.repeat(n);
};

export const textTags = ['A', 'P', 'SPAN', 'STRONG', 'B', 'I', 'BR', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI'];

export const checkNodeOnText = (node) => {
	const hasClassList = !!node.classList && !!node.classList.length;
	const isTextTag = textTags.indexOf(node.nodeName) > -1;

	return node.nodeName === '#text' || (isTextTag && !hasClassList);
};

export const checkNestingText = (parent, children, isIgnore) => { // if p span etc in text fields, we replace these children with textNode
	const nodesWithoutSpaces = children.filter((child, index) => {
		const isText = checkNodeOnText(child);

		if (isText && child.textContent.replace(/\s+/g, '') === '') {
			child.remove();
			return false;
		}

		return true;
	});

	if (isIgnore) return nodesWithoutSpaces;

	let textCounter = 0;
	const textNodeIndex = [];

	const filteredNodesArray = nodesWithoutSpaces.filter((child, index) => {
		const isText = checkNodeOnText(child);

		if (isText) {
			textCounter += 1;

			if (textCounter === 1) {
				const el = document.createTextNode('_reserved');
				child.after(el);
				textNodeIndex.push([el, index]);
			}

			child.remove();
			return false;
		}

		return true;
	});

	if (textNodeIndex.length) {
		textNodeIndex.forEach(([el, prevTextIndex]) => {
			if (filteredNodesArray[prevTextIndex]) {
				filteredNodesArray.splice(prevTextIndex, 0, el);
			} else {
				filteredNodesArray.push(el);
			}
		});
	}

	return filteredNodesArray;
};

export const createPhpIcon = ({
	child,
	nestingLevel,
}) => {
	const indent = `\n${getTabChar(nestingLevel)}`;
	const parentIndent = `\n${getTabChar(nestingLevel - 1)}`;
	const iconClasses = child.classList ? Array.from(child.classList) : null;

	if (!iconClasses.length) return;

	let iconName = iconClasses.filter((className, index) => {
		if (className.includes('icon_')) {
			iconClasses.splice(index, 1);
			return true;
		}
		return false;
	})[0];

	if (!iconName) return;

	iconName = iconName.replace(/icon_/, '');
	const restClasses = iconClasses.join(' ');

	if (!iconName) return;

	const getIcon = `<?php MTDUtils::the_icon( '${iconName}', '${restClasses}' ); ?>`;

	child.before(indent.concat(getIcon).concat(parentIndent));
	child.remove();
};

export const getRandomKey = () => {
	return Math.floor(Math.random() * (9999999999999 - 1111111111111)) + 1111111111111;
};
