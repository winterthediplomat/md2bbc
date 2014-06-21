test("autourl - non-http urls are not recognized", function(){
	var starting_text = ["<asdf>", "<http://nwa>"],
		expected = ["<asdf>", "<http://nwa>"];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});