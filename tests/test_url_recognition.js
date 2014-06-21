test("urls - non-http urls are not recognized",function(){
	var starting_text= [
					"lol]()",
					"[test](asdf)",
					"[](http://nwa)",
					"[twitter account!](http://twitter.com/alfateam123)",
					"[twitter account!](https://twitter.com/alfateam123)",
					"[asdada]asdadsad",
					"(lol)",
					"[launch this game!](steam://this.game/)"
					],
	expected= [
				"lol]()",
				"[test](asdf)",
				"[](http://nwa)",
				"[url=http://twitter.com/alfateam123]twitter account![/url]",
				"[url=https://twitter.com/alfateam123]twitter account![/url]",
				"[asdada]asdadsad",
				"(lol)",
				"[launch this game!](steam://this.game/)"
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