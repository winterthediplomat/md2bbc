test("[wikipedia]",function(){
	var starting_text= [
					"<http://en.wikipedia.org/wiki/Turing>",
					"<http://it.wikipedia.org/wiki/Punti_del_poker>",
					"<http://www.wikipedia.org/>",
					"<http://ja.wikipedia.org/wiki/ポケモン_(曖昧さ回避)>",
					"<http://it.wikipedia.org/Punti_del_poker>"
					],
	expected= [
				"[wiki=en]Turing[/wiki]",
				"[wiki=it]Punti del poker[/wiki]",
				"[url]http://www.wikipedia.org/[/url]",
				"[wiki=ja]ポケモン (曖昧さ回避)[/wiki]",
				"[url]http://it.wikipedia.org/Punti_del_poker[/url]",
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