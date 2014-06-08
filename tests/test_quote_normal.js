test("quote - normal behaviour", function(){
	var starting_text = [
					">4chan\n>style\n>is triggered!\nnot in the quote",
					">one\ntwo\n>three\n>four\n_five_\n**six**"
					],
	expected= [
				"[quote]\n4chan\nstyle\nis triggered!\nnot in the quote\n[/quote]",
				"[quote]\none\ntwo\nthree\nfour\n[cur]five[/cur]\n[b]six[/b]\n[/quote]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
})