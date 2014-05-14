loadTests([
{
	description: "bbcode handling - normal behaviour",
	//bbcode must not be modified.
	starting_text: [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**"
					],
	expected: [
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa][url]http://google.com[/url][/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur][b]asd[/b][/cur]",
				"[b]asd[/b]"
			  ],
	options: null
},
{
	description: "bbcode handling - recognize_bbcode=true",
	/*
	Markdown mixed with BBCode is ok, but!
	Inside some bbcodes, special rules must be followed.
	(the text inside the tags that are _not_ here can be freely modified)
	> [code]:     no modification can be done into these tags. I think the reason is obvious.
	> [url]:      no url must be recognized here: we don't want to generate [url]s into [url]s. The rest is ok.
	> [m]/[math]: no modification can be done into these tags: LaTeX may require some symbols that are actually used by Markdown for formatting
	*/
	starting_text: [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**",
					"[code=sh]find .*.* | grep torrent$[/code]",
					"[url]**muh text!**[/url]",
					"[m]\sqrt-1 * \frac{5}{b*2*3}-q_a_d[/m]",
					"[math]\sqrt-1 * \frac{5}{b*2*3}-q_a_d[/math]"
					],
	expected: [
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa]<http://google.com>[/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur][b]asd[/b][/cur]", //this is ok tho
				"[b]asd[/b]",
				"[code=sh]find .*.* | grep torrent$[/code]",
				"[url][b]muh text![/b][/url]",
				"[m]\sqrt-1 * \frac{5}{b*2*3}-q_a_d[/m]",
				"[math]\sqrt-1 * \frac{5}{b*2*3}-q_a_d[/math]"
 			  ],
	options: {recognize_bbcode: true}
}
]);