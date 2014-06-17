from os import walk, path

test_cases = []

#print "oh, hi!"

for act, dirs, files in walk("../tests/from_showdown/"):
    #print act, dirs, files
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
        # print (f)
        md_text, res_text = open(path.join("../tests/from_showdown", f+".md")).read(), open(path.join("../tests/from_showdown", f+".bbcode")).read()
        #print( res_text.strip().replace("\n", "\\n").replace("\"", "\\\"") )
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
        	

open(path.join("../tests", "test_from_showdown.js"), "w").write("""test("from showdown", function(){
	var conv = new Showdown.converter();
	%s
});
"""%("\n".join(test_cases)))