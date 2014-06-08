test("[gist]",function(){
	var starting_text= [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857>",
					"<https://gist.github.com/alfateam123/8055226>",
					"<https://gist.github.com/alfateam123>"
					],
	expected= [
				"[gist]7cc354929eb3d8817857[/gist]", //"secret" gists
				"[gist]8055226[/gist]", //public gists
				"[url]https://gist.github.com/alfateam123[/url]"
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