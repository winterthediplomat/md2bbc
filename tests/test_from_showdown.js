test("from showdown", function(){
	var conv = new Showdown.converter();
	
strictEqual(
    conv.makeBBCode("\nThis is [an example][id] reference-style link.\nThis is [another] [foo] reference-style link.\nThis is [a third][bar] reference-style link.\nThis is [a fourth][4] reference-style link.\n\n  [id]: http://example.com/  \"Optional Title Here\"\n  [foo]: http://example.com/  (Optional Title Here)\n  [bar]: http://example.com/  (Optional Title Here)\n  [4]: <http://example.com/>\n    \"Optional Title Here\""),
    "This is [url=http://example.com/]an example[/url] reference-style link.\nThis is [url=http://example.com/]another[/url] reference-style link.\nThis is [url=http://example.com/]a third[/url] reference-style link.\nThis is [url=http://example.com/]a fourth[/url] reference-style link.",
    "anchors-by-reference"
    );


strictEqual(
    conv.makeBBCode("\n<http://example.com/>"),
    "[url]http://example.com/[/url]",
    "automatic-anchors"
    );


strictEqual(
    conv.makeBBCode("  \n  > This is a multi line blockquote test\n  >\n  > With more than one line."),
    "[quote]\nThis is a multi line blockquote test\n\nWith more than one line.\n[/quote]",
    "blockquote"
    );


strictEqual(
    conv.makeBBCode("> ## This is a header.\n>\n> 1.   This is the first list item.\n> 2.   This is the second list item.\n>\n> Here's some example code:\n>\n>     return shell_exec(\"echo $input | $markdown_script\");"),
    "[quote]\n[big]This is a header.[/big]\n\n[list]\n[*] This is the first list item.\n[*] This is the second list item.\n[/list]\n\nHere's some example code:\n\n[code=code]return shell_exec(\"echo $input | $markdown_script\");[/code]\n[/quote]",
    "blockquote-nested-markdown"
    );


strictEqual(
    conv.makeBBCode("\nThis is a normal paragraph:\n\n    This is a code block."),
    "This is a normal paragraph:\n\n[code=code]This is a code block.[/code]",
    "code-block"
    );


strictEqual(
    conv.makeBBCode("\nThis is some HTML:\n\n    <h1>Heading</h1>"),
    "This is some HTML:\n\n[code=code]<h1>Heading</h1>[/code]",
    "code-block-html-escape"
    );


strictEqual(
    conv.makeBBCode("\n *  Bird\n\n *  Magic"),
    "[list]\n[*] Bird\n[*] Magic\n[/list]",
    "doubline-list"
    );


strictEqual(
    conv.makeBBCode("\n*important*\n\n_important_\n\nthis mid*important*sentence\n\n\\*not important\\*"),
    "[cur]important[/cur]\n\n[cur]important[/cur]\n\nthis mid[cur]important[/cur]sentence\n\n*not important*",
    "emphasis"
    );


strictEqual(
    conv.makeBBCode("It happened in 1986\\.  What a great season."),
    "It happened in 1986.  What a great season.",
    "escaped-number-period"
    );


strictEqual(
    conv.makeBBCode("\nThese should all be escaped:\n\n\\\\\n\n\\`\n\n\\*\n\n\\_\n\n\\{\n\n\\}\n\n\\[\n\n\\]\n\n\\(\n\n\\)\n\n\\#\n\n\\+\n\n\\-\n\n\\.\n\n\\!"),
    "These should all be escaped:\n\n\\\n\n`\n\n*\n\n_\n\n{\n\n}\n\n[\n\n]\n\n(\n\n)\n\n#\n\n+\n\n-\n\n.\n\n!",
    "escaping"
    );


strictEqual(
    conv.makeBBCode("```\nfunction MyFunc(a) {\n    // ...\n}\n```\n\nThat is some code!"),
    "[code=code]\nfunction MyFunc(a) {\n    // ...\n}\n[/code]\n\nThat is some code!",
    "github-style-at-start"
    );


strictEqual(
    conv.makeBBCode("\nDefine a function in javascript:\n\n```\nfunction MyFunc(a) {\n    var s = '`';\n}\n```\n\nAnd some HTML\n\n```html\n<div>HTML!</div>\n```"),
    "Define a function in javascript:\n\n[code=code]function MyFunc(a) {\n    var s = '`';\n}\n[/code]\n\nAnd some HTML\n\n[code=html]<div>HTML!</div>[/code]",
    "github-style-codeblock"
    );


strictEqual(
    conv.makeBBCode("```\ncode can go here\nthis is rendered on a second line\n```"),
    "[code=code]\ncode can go here\nthis is rendered on a second line\n[/code]",
    "github-style-linebreaks"
    );


strictEqual(
    conv.makeBBCode("# This is an H1 #"),
    "[big]This is an H1[/big]",
    "h1-with-double-hash"
    );


strictEqual(
    conv.makeBBCode("This is an H1\n============="),
    "[big]This is an H1[/big]",
    "h1-with-equals"
    );


strictEqual(
    conv.makeBBCode("# This is an H1"),
    "[big]This is an H1[/big]",
    "h1-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("This is an H2\n-------------"),
    "[big]This is an H2[/big]",
    "h2-with-dashes"
    );


strictEqual(
    conv.makeBBCode("## This is an H2 ##"),
    "[big]This is an H2[/big]",
    "h2-with-double-hash"
    );


strictEqual(
    conv.makeBBCode("## This is an H2"),
    "[big]This is an H2[/big]",
    "h2-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("### This is an H3 ###"),
    "[small]This is an H3[/small]",
    "h3-with-double-hash"
    );


strictEqual(
    conv.makeBBCode("### This is an H3"),
    "[small]This is an H3[/small]",
    "h3-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("#### This is an H4"),
    "This is an H4",
    "h4-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("##### This is an H5"),
    "This is an H5",
    "h5-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("###### This is an H6"),
    "This is an H6",
    "h6-with-single-hash"
    );


strictEqual(
    conv.makeBBCode("\n* * *\n\n***\n\n*****\n\n- - -\n\n---------------------------------------\n"),
    "[hr]\n\n[hr]\n\n[hr]\n\n[hr]\n\n[hr]",
    "horizontal-rules"
    );


strictEqual(
    conv.makeBBCode("\nThese HTML5 tags should pass through just fine.\n\n<section>hello</section>\n<header>head</header>\n<footer>footsies</footer>\n<nav>navigation</nav>\n<article>read me</article>\n<aside>ignore me</aside>\n<article>read\nme</article>\n<aside>\nignore me\n</aside>\n\nthe end"),
    "These HTML5 tags should pass through just fine.\n\n<section>hello</section>\n\n<header>head</header>\n\n<footer>footsies</footer>\n\n<nav>navigation</nav>\n\n<article>read me</article>\n\n<aside>ignore me</aside>\n\n<article>read\nme</article>\n\n<aside>\nignore me\n</aside>\n\nthe end",
    "html5-strutural-tags"
    );


strictEqual(
    conv.makeBBCode("\n![Alt text](/path/to/img.jpg)\n\n![Alt text](/path/to/img.jpg \"Optional title\")\n\n![Alt text][id]\n\n  [id]: url/to/image  \"Optional title attribute\""),
    "[img]/path/to/img.jpg[/img]\n\n[img]/path/to/img.jpg[/img]\n\n[img]url/to/image[/img]",
    "images"
    );


strictEqual(
    conv.makeBBCode("\nSearch the web at [Google][] or [Daring Fireball][].\n\n  [Google]: http://google.com/\n  [Daring Fireball]: http://daringfireball.net/"),
    "Search the web at [url=http://google.com/]Google[/url] or [url=http://daringfireball.net/]Daring Fireball[/url].",
    "implicit-anchors"
    );


strictEqual(
    conv.makeBBCode("\nThis is [an example](http://example.com/ \"Title\") inline link.\n\n[This link](http://example.net/) has no title attribute."),
    "This is [url=http://example.com/]an example[/url] inline link.\n\n[url=http://example.net/]This link[/url] has no title attribute.",
    "inline-anchors"
    );


strictEqual(
    conv.makeBBCode("\nCreate a new `function`.\n\nUse the backtick in MySQL syntax ``SELECT `column` FROM whatever``.\n\nA single backtick in a code span: `` ` ``\n\nA backtick-delimited string in a code span: `` `foo` ``\n\nPlease don't use any `<blink>` tags.\n\n`&#8212;` is the decimal-encoded equivalent of `&mdash;`."),
    "Create a new [code]function[/code].\n\nUse the backtick in MySQL syntax [code]SELECT `column` FROM whatever[/code].\n\nA single backtick in a code span: [code]`[/code]\n\nA backtick-delimited string in a code span: [code]`foo`[/code]\n\nPlease don't use any [code]<blink>[/code] tags.\n\n[code]&amp;#8212;[/code] is the decimal-encoded equivalent of [code]&amp;mdash;[/code].",
    "inline-code"
    );


strictEqual(
    conv.makeBBCode("\nHello.this\\_is\\_a\\_variable\nand.this.is.another_one"),
    "Hello.this_is_a_variable\nand.this.is.another_one",
    "inline-escaped-chars"
    );


strictEqual(
    conv.makeBBCode("\n<style>\n    p { line-height: 20px; }\n</style>\n\nAn exciting sentence."),
    "<style>\n    p { line-height: 20px; }\n</style>\n\nAn exciting sentence.",
    "inline-style-tag"
    );


strictEqual(
    conv.makeBBCode("\n  > This is a multi line blockquote test\n\n  > With more than one line."),
    "[quote]\nThis is a multi line blockquote test\n\nWith more than one line.\n[/quote]",
    "lazy-blockquote"
    );


strictEqual(
    conv.makeBBCode("*   A list item with a blockquote:\n\n    > This is a blockquote\n    > inside a list item."),
    "[list]\n[*] A list item with a blockquote:\n\n[quote]\nThis is a blockquote\ninside a list item.\n[/quote]\n[/list]",
    "list-with-blockquote"
    );


strictEqual(
    conv.makeBBCode("*   A list item with code:\n\n        alert('Hello world!');"),
    "[list]\n[*] A list item with code:\n\n[code]alert('Hello world!');\n[/code]\n[/list]",
    "list-with-code"
    );


strictEqual(
    conv.makeBBCode("\n 1.  This is a major bullet point.\n\n    That contains multiple paragraphs.\n\n 2.  And another line"),
    "[list]\n[*] This is a major bullet point.\n\n    That contains multiple paragraphs.\n[*] And another line\n[/list]",
    "multi-paragraph-list"
    );


strictEqual(
    conv.makeBBCode("\n - This line spans\n more than one line and is lazy\n - Similar to this line"),
    "[list]\n[*] This line spans\n more than one line and is lazy\n[*] Similar to this line\n[/list]",
    "multiline-unordered-list"
    );


strictEqual(
    conv.makeBBCode("\n  > This is a multi line blockquote test\n  >\n  > > And nesting!\n  >\n  > With more than one line."),
    "[quote]\nThis is a multi line blockquote test\n\n[quote]\nAnd nesting!\n[/quote]\nWith more than one line.\n[/quote]",
    "nested-blockquote"
    );


strictEqual(
    conv.makeBBCode("\n 1.  Red\n 2.  Green\n 3.  Blue"),
    "[list]\n[*] Red\n[*] Green\n[*] Blue\n[/list]",
    "ordered-list"
    );


strictEqual(
    conv.makeBBCode("\n 1.  Red\n 1.  Green\n 1.  Blue"),
    "<ol>\n[*] Red\n[*] Green\n[*] Blue\n</ol>",
    "ordered-list-same-number"
    );


strictEqual(
    conv.makeBBCode("\n 8.  Red\n 1.  Green\n 3.  Blue"),
    "[list]\n[*] Red\n[*] Green\n[*] Blue\n[/list]",
    "ordered-list-wrong-numbers"
    );


strictEqual(
    conv.makeBBCode("\nSee my [About](/about/) page for details."),
    "See my [url=\"/about/\"]About[/url] page for details.",
    "relative-anchors"
    );


strictEqual(
    conv.makeBBCode("\nHello, world!"),
    "Hello, world!",
    "simple-paragraph"
    );


strictEqual(
    conv.makeBBCode("\n**important**\n\n__important__\n\nreally **freaking**strong"),
    "[b]important[/b]\n\n[b]important[/b]\n\nreally [b]freaking[/b]strong",
    "strong"
    );


strictEqual(
    conv.makeBBCode("\n * Red\n * Green\n * Blue"),
    "[list]\n[*] Red\n[*] Green\n[*] Blue\n[/list]",
    "unordered-list-asterisk"
    );


strictEqual(
    conv.makeBBCode("\n - Red\n - Green\n - Blue"),
    "[list]\n[*] Red\n[*] Green\n[*] Blue\n[/list]",
    "unordered-list-minus"
    );


strictEqual(
    conv.makeBBCode("\n + Red\n + Green\n + Blue"),
    "[list]\n[*] Red\n[*] Green\n[*] Blue\n[/list]",
    "unordered-list-plus"
    );


strictEqual(
    conv.makeBBCode("\nThere's an [episode](http://en.memory-alpha.org/wiki/Darmok_(episode)) of Star Trek: The Next Generation"),
    "There's an [url=http://en.memory-alpha.org/wiki/Darmok_(episode)]episode[/url] of Star Trek: The Next Generation",
    "url-with-parenthesis"
    );

});
