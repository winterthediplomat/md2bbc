/* BBCode enabled by default at the moment

test("bbcode handling - normal behaviour", function(){
	//bbcode must not be modified.
	var starting_text= [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**",
					"saafa _asdasd_\n[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_ad[/math]_\n[cur]**asd**[/cur]\n[url=http://google.com]<http://alfateam123.niggazwithattitu.de>[/url]"
					],
	expected= [
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa][url]http://google.com[/url][/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur][b]asd[/b][/cur]",
				"[b]asd[/b]",
				"saafa [cur]asdasd[/cur]\n[math]\\sqrt-1 * \\frac{5}{b[cur]2[/cur]3}-q[cur]ad[/math][/cur]\n[cur][b]asd[/b][/cur]\n[url=http://google.com][url]http://alfateam123.niggazwithattitu.de[/url][/url]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});*/
test("bbcode handling - recognize_bbcode=true", function(){
	/*
	Markdown mixed with BBCode is ok, but!
	Inside some bbcodes, special rules must be followed.
	(the text inside the tags that are _not_ here can be freely modified)
	> [code]:     no modification can be done into these tags. I think the reason is obvious.
	> [url]:      no url must be recognized here: we don't want to generate [url]s into [url]s. The rest is ok.
	> [m]/[math]: no modification can be done into these tags: LaTeX may require some symbols that are actually used by Markdown for formatting
	*/
	var starting_text= [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**",
					"[code=sh]find .*.* | grep torrent$[/code]",
					"[url]**muh text!**[/url]",
					"[m]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/m]",
					"[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/math]",
					"saafa _asdasd_\n[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_ad[/math]_\n[cur]**asd**[/cur]\n[url=http://google.com]<http://alfateam123.niggazwithattitu.de>[/url]"
					],
	expected= [
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa]<http://google.com>[/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur][b]asd[/b][/cur]", //this is ok tho
				"[b]asd[/b]",
				"[code=sh]find .*.* | grep torrent$[/code]",
				"[url][b]muh text![/b][/url]",
				"[m]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/m]",
				"[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/math]",
				"saafa [cur]asdasd[/cur]\n[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_ad[/math]\n_\n[cur][b]asd[/b][/cur]\n[url=http://google.com]<http://alfateam123.niggazwithattitu.de>[/url]"
 			  ];
	var conv = new Showdown.converter({recognize_bbcode: true});
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});