loadTests({
	description: "autourl - non-http urls are not recognized",
	starting_text: ["<asdf>", "<http://nwa>"],
	expected: ["<asdf>", "<http://nwa>"],
	options: null
});