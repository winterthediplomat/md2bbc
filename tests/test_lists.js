loadTests([
{
	description: "lists - normal behaviour",
	starting_text: [
					"* Asagi\n* Charlotte \n* Tsurugi",
					"* Asagi\n* Charlotte \n* Tsurugi\ntest",
					],
	expected: [
				"[list]\n[*] Asagi\n[*] Charlotte \n[*] Tsurugi\n[/list]",
				"[list]\n[*] Asagi\n[*] Charlotte \n[*] Tsurugi\ntest\n[/list]"
			  ],
	options: null
},
{
	description: "lists - quotes into lists",
	starting_text: [
					"* Asagi\n* Charlotte \n* >Tsurugi\n>not goddess",
					],
	expected: [
				"[list]\n[*] Asagi\n[*] Charlotte \n[*] [quote]Tsurugi\nnot goddess\n[/list]\n[/quote]",
			  ],
	options: null
},

]);