import katex from "katex";
import utils from "../utils";

const specialCharacters = ['<', '>'];

function render(content, display) {
	return katex.renderToString(utils.unescape(content), {
		displayMode: display,
		throwOnError: false,
		strict: false,
	});
}

function renderHelper(content, openFlag, closeFlag, display) {
	let result = '', stack = '';
	Array.from(content).forEach(char => {
		stack += char;
		if (specialCharacters.includes(char) || (stack.length <= openFlag.length && !openFlag.startsWith(stack))) {
			result += stack, stack = '';
		} else if ((stack.length > closeFlag.length && stack.endsWith(closeFlag))) {
			result += render(stack.slice(openFlag.length, -closeFlag.length), display), stack = '';
		}
	});
	return result + stack;
}

export default function (content) {
	content = renderHelper(content, '$$', '$$', true);
	content = renderHelper(content, '$', '$', false);

	return content;
}