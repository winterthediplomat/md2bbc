loadTests({
	description: "url building - video tags",
	starting_text: [
					"<http://www.youtube.com/watch?v=r4qmUpAE9o8>",
					"<http://youtu.be/_ynuMmB91qM>",
					"<http://www.dailymotion.com/video/x1hfdxk>",
					"<http://vimeo.com/85752647>",
					"<https://www.facebook.com/photo.php?v=242255399300798>"
					],
	expected: [
				"[video]http://www.youtube.com/watch?v=r4qmUpAE9o8[/video]",
				"[video]http://youtu.be/_ynuMmB91qM[/video]",
				"[video]http://www.dailymotion.com/video/x1hfdxk[/video]",
				"[video]http://vimeo.com/85752647[/video]",
				"[video]https://www.facebook.com/photo.php?v=242255399300798[/video]"
			  ],
	options: null
});