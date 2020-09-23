import lodash from "lodash";

export default {
	unescape(content) {
		return lodash.unescape(content).replace(/&apos;/g, '\'')
	}
}