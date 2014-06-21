test("autourl - formatting", function(){
	var conv = new Showdown.converter();
	strictEqual(
		"[url]http://google.com[/url]",
		conv.makeBBCode("<http://google.com>"),
		"HTTP urls are recognized and formatted correctly"
		);
	strictEqual(
		"[url]https://wwwold.di.unipi.it[/url]",
		conv.makeBBCode("<https://wwwold.di.unipi.it>"),
		"HTTPS urls are recognized and formatted correctly"
		);
});