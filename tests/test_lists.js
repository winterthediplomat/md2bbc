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
	description: "lists - quotes into lists - normal behaviour",
	starting_text: [
					"* Asagi\n* Charlotte \n* >Tsurugi\n>not goddess",
					],
	expected: [
	            /*
	            as you can see from the html code produced by Markdown Dingus,
	            the </ul> tag is inside the </blockquote>. We have to consider
	            this behaviour the "normal" one.

	            <p><ul>
				<li>Asagi</li>
				<li>Charlotte </li>
				<li>>Tsurugi <br /></p>

				<blockquote>
				  <p>not a goddess</li>
				</ul></p>
				</blockquote>
	            */
				"[list]\n[*] Asagi\n[*] Charlotte \n[*] >Tsurugi\n\n[quote]\nnot goddess\n[/list]\n[/quote]",
			  ],
	options: null
},
{
	description: "lists - quotes into lists - using check_quotes_into_lists",
	starting_text: [
					"* Asagi\n* Charlotte \n* >Tsurugi\n>not goddess",
					],
	expected: [
				//_formParagraphs joins with \n\n. if using only one \n, several tests result as FAIL.
				"[list]\n[*] Asagi\n[*] Charlotte \n[*] [quote]\n\nTsurugi\nnot goddess\n\n[/quote]\n[/list]",
			  ],
	options: {check_quotes_into_lists: true}
}
]);