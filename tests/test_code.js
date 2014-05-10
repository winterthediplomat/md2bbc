loadTests([{
	description: "github code: don't stop at first ```",
	starting_text: [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\nls | grep html\n```"
					],
	expected: [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\nls | grep html\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]sh\nls | grep html\n```"
			  ],
	options: null
},
{
	description: "github code: don't recognize @users and #projects inside code",
	starting_text: [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\n\n@alfateam123"
					],
	expected: [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]\n[user]alfateam123[/user]"
			  ],
	options: null
},
{
	description: "github code: don't recognize word formattings inside code",
	starting_text: [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n**lol**\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n```\n**lol**"
					],
	expected: [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n**lol**\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code][b]lol[/b]"
			  ],
	options: null
},
{
	description: "github code: don't recognize urls inside code",
	starting_text: [
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\n[this](http://is.not.going.to.happen)\n```",
					"```perl\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```\nsh\n[this](http://is.going.to.happen)\n```"
					],
	expected: [
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n\n```sh\n[this](http://is.not.going.to.happen)\n[/code]",
				"[code=perl]\nuse Data::Dumper;\nprint Dumper($val);\nfor my $lol (@unrecognized){\n  #thenopeproject\n}\nprint **lolololol**\nprint \"do you wanna use ` ?\";\nprint `find .`;\n[/code]sh\n[url=http://is.going.to.happen]this[/url]\n```"
			  ],
	options: null
},
]);