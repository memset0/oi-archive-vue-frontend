import TurndownService from "turndown";

const turndownService = new TurndownService({
	codeBlockStyle: "fenced",
	fence: "```",
});

export default function turndown() {
	return turndownService.turndown(...arguments);
}