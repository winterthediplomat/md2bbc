loadTests({
	description: "images - recognition and formatting",
	starting_text: [
					"awful drawing here! ![it should be \"alt\"](http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg)",
					"![](http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg)",
					"![](loltest)"
					],
	expected: [
				"awful drawing here! [img]http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg[/img]",
				"[img]http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg[/img]",
				"![](loltest)"
			  ],
	options: null
});