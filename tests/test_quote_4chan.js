loadTests({
	description: "quote - 4chan",
	starting_text: [
					">4chan\n>style\n>is triggered!\nnot in the quote",
					">one\ntwo\n>three\n>four\n_five_\n**six**"
					],
	expected: [
				"[quote]4chan\nstyle\nis triggered!\n[/quote]\nnot in the quote",
				"[quote]\none\ntwo\nthree\nfour\n[cur]five[/cur]\n[b]six[/b]\n[/quote]"
			  ],
	options: {multiline_quoting: true}
});