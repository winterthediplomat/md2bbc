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

test("url - @s and #s does not break the URL creation", function(){
	var starting_text= [
					"[testoacaso](http://google.com)",
					"[](https://wwwold.di.unipi.it)",
					"[@user](http://google.com)",
					"[#project](https://wwwold.di.unipi.it)",
					"[@user (#project)](http://nerdz.eu)",
					"[**got** _shit_](http://4chan.org)",
					"<http://google.com/test?user=@user&project=#project>",
					"<http://lol.asd>"
					],
	expected= [
				"[url=http://google.com]testoacaso[/url]",
				"[url]https://wwwold.di.unipi.it[/url]",
				"[url=http://google.com]@user[/url]",
				"[url=https://wwwold.di.unipi.it]#project[/url]",
				"[url=http://nerdz.eu]@user (#project)[/url]",
				"[url=http://4chan.org][b]got[/b] [cur]shit[/cur][/url]",
				"[url]http://google.com/test?user=@user&project=#project[/url]",
				"[url]http://lol.asd[/url]"
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

