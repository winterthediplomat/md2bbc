test("url - formatting", function(){
	var starting_text= [
					"[](http://google.com)",
					"[](https://wwwold.di.unipi.it)",
					"[googoru](http://google.com)",
					"[back to the nineties!](https://wwwold.di.unipi.it)",
					],
	expected= [
				"[url]http://google.com[/url]",
				"[url]https://wwwold.di.unipi.it[/url]",
				"[url=http://google.com]googoru[/url]",
				"[url=https://wwwold.di.unipi.it]back to the nineties![/url]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});