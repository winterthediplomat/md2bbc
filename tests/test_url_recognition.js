loadTests({
	description: "urls - non-http urls are not recognized",
	starting_text: ["[test](asdf)", "[](http://nwa)", "[twitter account!](http://twitter.com/alfateam123)"],
	expected: ["[test](asdf)", "[](http://nwa)", "[url=http://twitter.com/alfateam123]twitter account![/url]"],
	options: null
});