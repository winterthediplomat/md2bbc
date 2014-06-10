test("quote - 4chan", function(){
	var conv = new Showdown.converter({"multiline_quoting": true});
	
	deepEqual(
		"[quote]4chan\nstyle\nis triggered!\n[/quote]\nnot in the quote",
		conv.makeBBCode(">4chan\n>style\n>is triggered!\nnot in the quote")
		);

	deepEqual(
		"[quote]\none\ntwo\nthree\nfour\n[cur]five[/cur]\n[b]six[/b]\n[/quote]",
		conv.makeBBCode(">one\ntwo\n>three\n>four\n_five_\n**six**")
		);
});

/*
test("quote - 4chan - lines between inner quotes must be the same", function(){
	var conv = new Showdown.converter({"multiline_quoting": true});

	notStrictEqual(
		conv.makeBBCode(">>tfw nothing\n>>but inane comments\n\n>mfw nothing\n>but inane comments\ndafaq"),
		"[quote][quote]tfw nothing\nbut inane comments\n[/quote]\nmfw nothingbut inane comments\n[/quote]\ndafaq"
	);
	strictEqual(
		conv.makeBBCode(">>tfw nothing\n>>but inane comments\n\n>mfw nothing\n>but inane comments\ndafaq"),
		"[quote][quote]tfw nothing\nbut inane comments\n[/quote]\nmfw nothing\nbut inane comments\n[/quote]\ndafaq"
	);
});
*/