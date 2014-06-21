test("images - recognition and formatting",function(){
	var starting_text= [
		"awful drawing here! ![it should be \"alt\"](http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg)",
		"![](http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg)",
		"![](loltest)",
		//local urls
		"![Alt text](/path/to/img.jpg)",
		"![Alt text](/path/to/img.jpg \"Optional title\")",
		//url-generated images
		"![](http://alfa.nwa/gimmeima.ge?type=cat&w=500&h=140)",
		//images with non-standard characters
		"![](http://alfateam123.niggazwithattitu.de/screens/Cattura%20di%20schermata%20(155).png)"
	],
	expected= [
		"awful drawing here! [img]http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg[/img]",
		"[img]http://31.media.tumblr.com/61c8bc1f8be79bf214c54688c7ed4377/tumblr_n4rhtwz7Bn1s825jqo1_1280.jpg[/img]",
		"![](loltest)",
		"[img]/path/to/img.jpg[/img]",
		"[img]/path/to/img.jpg[/img]",
		"[img]http://alfa.nwa/gimmeima.ge?type=cat&w=500&h=140[/img]",
		"[img]http://alfateam123.niggazwithattitu.de/screens/Cattura%20di%20schermata%20(155).png[/img]"
	];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			conv.makeBBCode(starting_text[i]),
			expected[i],
			starting_text[i]
			);
	}
});