from os import walk, path

test_cases = []

for act, dirs, files in walk("../tests/from_showdown/"):
    my_files = sorted(
    	set(
    		map(
    			lambda x: x.replace(".bbcode", "").replace(".md", ""), 
    			filter(lambda x: x.endswith(".md") or x.endswith(".bbcode"), files)
    		)
    	)
    )
    # MOAR PARENTESI PLS
    for f in my_files:
        md_text, res_text = open(f+".md").read(), open(f+".html").read()
        test_cases.append("""
strictEqual(
    conv.makeBBCode("%s"),
    "%s",
    "%s"
    );
"""%(md_text.strip().replace("\n", "\\n").replace("\"", "\\\""),
	res_text.strip().replace("\n", "\\n").replace("\"", "\\\""),
	f)
)
        	

print """test("from showdown", function(){
	var conv = new Showdown.converter();
	%s
});
"""%("\n".join(test_cases))