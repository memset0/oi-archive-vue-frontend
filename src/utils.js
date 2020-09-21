module.exports = {
	decodeHTML(str) {
		return str.replace(/&amp;/g, "&")
			.replace(/&lt;/g, "<")
			.replace(/&gt;/g, ">")
			.replace(/&nbsp;/g, " ")
			.replace(/&#39;/g, "'")
			.replace(/&quot;/g, "\"")
	}
}