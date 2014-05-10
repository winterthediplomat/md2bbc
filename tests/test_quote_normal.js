loadTests({
	description: "quote - normal behaviour",
	starting_text: [
					">4chan\n>style\n>is triggered!\nnot in the quote",
					">one\ntwo\n>three\n>four\n_five_\n**six**"
					],
	expected: [
				"[quote]\n4chan\nstyle\nis triggered!\nnot in the quote\n[/quote]",
				"[quote]\none\ntwo\nthree\nfour\n[cur]five[/cur]\n[b]six[/b]\n[/quote]"
			  ],
	options: null
});