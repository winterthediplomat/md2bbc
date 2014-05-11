loadTests({
	description: "formatting - [cur], [b]",
	starting_text: [
					"_yay_",
					"*yay*",
					"**yay**",
					"__yay__",
					"_test_asd_",
					"*test*asd*",
					"*test_asd*",
					"_test_ saddsa _testst _asd_",
					"*test* saddsa *testst _asd*",
					"*test* saddsa *testst *asd*",
					"perform_complicated_",
					"perform_complicated_task",
					"lol no underscores",
					"*first* _second_"
					],
	expected: [
				//the normal behaviour is this (tested against daringfireball dingus)
				"[cur]yay[/cur]",
				"[cur]yay[/cur]",
				"[b]yay[/b]",
				"[b]yay[/b]",
				"[cur]test[/cur]asd_", //github: [cur]test_asd[/cur]
				"[cur]test[/cur]asd*", //github: [cur]test*asd[/cur]
				"[cur]test_asd[/cur]",
				"[cur]test[/cur] saddsa [cur]testst _asd[/cur]",
				"[cur]test[/cur] saddsa [cur]testst _asd[/cur]",
				"[cur]test[/cur] saddsa [cur]testst *asd[/cur]",  //dingus, github: [cur]test[/cur] saddsa [cur]testst *asd[/cur]
				"perform[cur]complicated[/cur]", //github: perform_complicated_
				"perform[cur]complicated[/cur]task", //github: perform_complicated_task
				"lol no underscores",
				"[cur]first[/cur] [cur]second[/cur]"
			  ],
	options: null
});