loadTests({
	description: "url - formatting",
	starting_text: [
					"[](http://google.com)",
					"[](https://wwwold.di.unipi.it)",
					"[googoru](http://google.com)",
					"[back to the nineties!](https://wwwold.di.unipi.it)",
					],
	expected: [
				"[url]http://google.com[/url]",
				"[url]https://wwwold.di.unipi.it[/url]",
				"[url=http://google.com]googoru[/url]",
				"[url=https://wwwold.di.unipi.it]back to the nineties![/url]"
			  ],
	options: null
});