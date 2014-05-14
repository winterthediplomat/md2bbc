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
	//bbcode must not be modified.
	starting_text: [
					"<https://gist.github.com/alfateam123/7cc354929eb3d8817857> [url=http://nwa]<http://google.com>[/url]",
					"<https://gist.github.com/alfateam123/8055226>",
					"[cur]asd[/cur]",
					"[cur]**asd**[/cur]",
					"**asd**"
					],
	expected: [
				"[gist]7cc354929eb3d8817857[/gist] [url=http://nwa]<http://google.com>[/url]", 
				"[gist]8055226[/gist]", 
				"[cur]asd[/cur]",
				"[cur]**asd**[/cur]",
				"[b]asd[/b]"
			  ],
	options: {recognize_bbcode: true}
}
]);