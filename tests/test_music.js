test("url building - music tags", function(){
	var starting_text= [
					"<https://www.deezer.com/album/7509216>",
					"<https://www.deezer.com/track/75795831>",
					"<https://www.deezer.com/playlist/66498465>",
					"<https://play.spotify.com/track/7EE7jbv7Dv8ZkyWBlKhPXX>",
					"<https://soundcloud.com/deletefile/der-dub-dream>"
					],
	expected= [
				"[music]https://www.deezer.com/album/7509216[/music]",
				"[music]https://www.deezer.com/track/75795831[/music]",
				"[music]https://www.deezer.com/playlist/66498465[/music]",
				"[music]spotify:track:7EE7jbv7Dv8ZkyWBlKhPXX[/music]",
				"[music]https://soundcloud.com/deletefile/der-dub-dream[/music]",
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