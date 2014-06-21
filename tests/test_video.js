test("url building - video tags",function(){
	var starting_text= [
					"<http://www.youtube.com/watch?v=r4qmUpAE9o8>",
					"<http://youtu.be/_ynuMmB91qM>",
					"<http://www.dailymotion.com/video/x1hfdxk>",
					"<http://vimeo.com/85752647>",
					"<https://www.facebook.com/photo.php?v=242255399300798>"
					],
	expected= [
				"[video]http://www.youtube.com/watch?v=r4qmUpAE9o8[/video]",
				"[video]http://youtu.be/_ynuMmB91qM[/video]",
				"[video]http://www.dailymotion.com/video/x1hfdxk[/video]",
				"[video]http://vimeo.com/85752647[/video]",
				"[video]https://www.facebook.com/photo.php?v=242255399300798[/video]"
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