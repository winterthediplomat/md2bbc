loadTests({
	description: "autourl - formatting",
	starting_text: [
					"<http://google.com>",
					"<https://wwwold.di.unipi.it>"
					],
	expected: [
				"[url]http://google.com[/url]",
				"[url]https://wwwold.di.unipi.it[/url]"
			  ],
	options: null
});