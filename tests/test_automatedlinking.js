test("automated linking",function(){
	var starting_text= [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857>",
					"https://gist.github.com/alfateam123/7cc354929eb3d8817857",
					"http://nerdz.eu",
					"nerdz.eu",
					"**test**",
					"http://google.com/test.pl?test=5",
					"in a http://rubular.com test",
					"test [url=http://google.com]http://google.com[/url]"
					],
	expected= [
				"[gist]7cc354929eb3d8817857[/gist]",
				"[url]https://gist.github.com/alfateam123/7cc354929eb3d8817857[/url]",
				"[url]http://nerdz.eu[/url]",
				"nerdz.eu",
				"[b]test[/b]",
				"[url]http://google.com/test.pl?test=5[/url]",
				"in a [url]http://rubular.com[/url] test",
				"test [url=http://google.com]http://google.com[/url]"
			  ];
	var conv = new Showdown.converter({enable_autolinking:true});
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			conv.makeBBCode(starting_text[i]),
			expected[i]
			//starting_text+" => "+expected
			);
	}
});

test("automated linking - recognize_bbcode enabled",function(){
	var starting_text= [
					//tests from test_bbcode.js
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**",
					"[code=sh]find .*.* | grep torrent$[/code]",
					"[url]**muh text!**[/url]",
					"[m]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/m]",
					"[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/math]",
					"saafa _asdasd_\n[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_ad[/math]_\n[cur]**asd**[/cur]\n[url=http://google.com]<http://alfateam123.niggazwithattitu.de>[/url]",
					//new tests
					"http://google.com",
					"htt:p//google.com",
					"https://gist.github.com/alfateam123/8055226",
					"[code=perl]my newurl = \"http://google.com\"[/code]",
					"[url]http://google.com[/url]"
					],
	expected= [
				//tests from test_bbcode.js
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa]<http://google.com>[/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur][b]asd[/b][/cur]", //this is ok tho
				"[b]asd[/b]",
				"[code=sh]find .*.* | grep torrent$[/code]",
				"[url][b]muh text![/b][/url]",
				"[m]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/m]",
				"[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_a_d[/math]",
				"saafa [cur]asdasd[/cur]\n[math]\\sqrt-1 * \\frac{5}{b*2*3}-q_ad[/math]_\n[cur][b]asd[/b][/cur]\n[url=http://google.com]<http://alfateam123.niggazwithattitu.de>[/url]",
				//new tests
				"[url]http://google.com[/url]",
				"htt:p//google.com",
				"[url]https://gist.github.com/alfateam123/8055226[/url]",
				"[code=perl]my newurl = \"http://google.com\"[/code]",
				"[url]http://google.com[/url]"
 			  ];
	var conv = new Showdown.converter({enable_autolinking:true, recognize_bbcode: true});
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});


test("automated linking - not enabled",function(){
	var starting_text= [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857>",
					"https://gist.github.com/alfateam123/7cc354929eb3d8817857",
					"http://nerdz.eu",
					"nerdz.eu",
					"**test**"
					],
	expected= [
				"[gist]7cc354929eb3d8817857[/gist]",
				"https://gist.github.com/alfateam123/7cc354929eb3d8817857",
				"http://nerdz.eu",
				"nerdz.eu",
				"[b]test[/b]"
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