test("autourl - formatting", function(){
	var conv = new Showdown.converter();
	var starting = [
		"<http://google.com>",
		"<https://wwwold.di.unipi.it>",
		"<http://google.com/test?user=@user&project=#project>",
		"<http://lol.asd>",
		"<http://nonchosbatta.omnivium.it/#/users/Qualcuno%20lo%20far%C3%A0/timer>",
		"<http://httpbin.org/response-headers?Content-Type=text/plain;%20charset=UTF-8&Server=httpbin>"
	];
	var expected = [
		"[url]http://google.com[/url]",
		"[url]https://wwwold.di.unipi.it[/url]",
		"[url]http://google.com/test?user=@user&project=#project[/url]",
		"[url]http://lol.asd[/url]",
		"[url]http://nonchosbatta.omnivium.it/#/users/Qualcuno%20lo%20far%C3%A0/timer[/url]",
		"[url]http://httpbin.org/response-headers?Content-Type=text/plain;%20charset=UTF-8&Server=httpbin[/url]"
	];
	var descriptions = [
		"HTTP urls are recognized and formatted correctly",
		"HTTPS urls are recognized and formatted correctly",
		"# and @ into projects don't generate [project] and [user] tags",
		"random extensions",
		"urlencoded url",
		"& does not become &amp;"
	];
	for(var i=0; i<starting.length; i++){
		strictEqual(
			conv.makeBBCode(starting[i]),
			expected[i],
			descriptions[i] || "okay"
		);
	}
});
