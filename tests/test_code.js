test("github code: don't stop at first ```",function(){
	var starting_text = [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\nls | grep html\n```"
					],
	expected = [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]sh\nls | grep html\n```"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});
test("github code: don't recognize @users and #projects inside code", function(){
	var starting_text =  [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\n\n@alfateam123"
					],
	expected = [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]\n[user]alfateam123[/user]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});
test("github code: don't recognize word formattings inside code", function(){
	var starting_text= [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n**lol**\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n```\n**lol**"
					],
	expected= [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n**lol**\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code][b]lol[/b]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});
test("github code: don't recognize urls inside code",function(){
	var starting_text = [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\n[this](http://is.not.going.to.happen)\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\n[this](http://is.going.to.happen)\n```"
					],
	expected = [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\n[this](http://is.not.going.to.happen)\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]sh\n[url=http://is.going.to.happen]this[/url]\n```"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});

test("4-spaced code ",function(){
	var starting_text = [
					//"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n```",
					"    use Data::Dumper;\n    print Dumper($val);\n    for my $lol (@unrecognized){\n      #thenopeproject\n    }\n    print **lolololol**\n    print \"do you wanna use ` ?\";\n    print `find .`;\n\n    ```sh\n    ls | grep html\n    ```",
					//"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\nls | grep html\n```"
					"    use Data::Dumper;\n    print Dumper($val);\n    for my $lol (@unrecognized){\n      #thenopeproject\n    }\n    print **lolololol**\n    print \"do you wanna use ` ?\";\n    print `find .`;\n\n    ```\n    sh\n    ls | grep html\n    ```"
					],
	expected = [
				//"[code=code]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n[/code]",
				"[code=code]use Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n```[/code]",
				//"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]sh\nls | grep html\n```"
				"[code=code]use Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\nls | grep html\n```[/code]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			expected[i],
			conv.makeBBCode(starting_text[i])
			//starting_text+" => "+expected
			);
	}
});