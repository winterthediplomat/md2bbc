loadTests({
	description: "[gist]",
	starting_text: [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857>",
					"<https://gist.github.com/alfateam123/8055226>",
					"<https://gist.github.com/alfateam123>"
					],
	expected: [
				"[gist]7cc354929eb3d8817857[/gist]", //"secret" gists
				"[gist]8055226[/gist]", //public gists
				"[url]https://gist.github.com/alfateam123[/url]"
			  ],
	options: null
});