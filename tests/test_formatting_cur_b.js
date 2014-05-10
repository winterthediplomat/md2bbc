loadTests({
	description: "formatting - [cur], [b]",
	starting_text: [
					"_yay_",
					"*yay*",
					"**yay**",
					"__yay__",
					"_test_asd_",
					"*test_asd*"
					],
	expected: [
				"[cur]yay[/cur]",
				"[cur]yay[/cur]",
				"[b]yay[/b]",
				"[b]yay[/b]",
				"[cur]test_asd[/cur]",
				"[cur]test_asd[/cur]"
			  ],
	options: null
});