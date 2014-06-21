import httplib, urllib, sys
from os import path, walk
from string import Template

def minify_js(readablejs_path, minifiedjs_path):
    #adapted from the Closure Compiler documentation
    # Define the parameters for the POST request and encode them in
    # a URL-safe format.

    params = urllib.urlencode([
        ('js_code', open(readablejs_path).read()),
        ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
        ('output_format', 'text'),
        ('output_info', 'compiled_code'),
      ])

    # Always use the following value for the Content-type header.
    headers = { "Content-type": "application/x-www-form-urlencoded" }
    conn = httplib.HTTPConnection('closure-compiler.appspot.com')
    conn.request('POST', '/compile', params, headers)
    response = conn.getresponse()
    data = response.read()
    open(minifiedjs_path, "w").write(data);
    conn.close()

def is_js_valid(readablejs_path):
    #adapted from the Closure Compiler documentation
    # Define the parameters for the POST request and encode them in
    # a URL-safe format.
    def askTheCompiler(readablejs_path, desired_output_info):
        params = urllib.urlencode([
            ('js_code', open(readablejs_path).read()),
            ('compilation_level', 'SIMPLE_OPTIMIZATIONS'),
            ('output_format', 'text'),
            ('output_info', desired_output_info),
          ])

        # Always use the following value for the Content-type header.
        headers = { "Content-type": "application/x-www-form-urlencoded" }
        conn = httplib.HTTPConnection('closure-compiler.appspot.com')
        conn.request('POST', '/compile', params, headers)
        response = conn.getresponse()
        data = response.read()
        #open(minifiedjs_path, "w").write(data);
        #print(data)
        conn.close()
        return data
    results = [{outinfo: askTheCompiler(readablejs_path, outinfo)} for outinfo in ["warnings", "errors"]]
    #print(results)
    return {"result": any(k.values()[0]=="" for k in results), "responses":results}

def build_testpage(js_path):
    ignorelist = open("test_ignorelist.txt").read().splitlines()
    js_files = []
    for act_path, dirs_, files_ in walk("../tests"):
        #print files_
        js_files += [path.join(act_path, jsf) for jsf in files_ if jsf.endswith(".js") and jsf not in ignorelist]
    print( ">>>", js_files )
    testpage_template = Template(open("testpage.tmpl").read())
    return testpage_template.safe_substitute(
        JS_PATH = js_path,
        TESTLOAD_LIST = "\n".join(
            "<script type='text/javascript' src='"+testpath+"'></script>"
            for testpath in set(js_files) #removing duplicates. 
            )
        )
    

if __name__=="__main__":
    readablejs_path = '../src/showdown.js'
    minifiedjs_path = "../src/showdown.min.js"

    if len(sys.argv)==1 or sys.argv[1] != '--no-minify':
        check = is_js_valid(readablejs_path)
        if check["result"]:
            print("the code is ok!")
            minify_js(readablejs_path, minifiedjs_path)
        else:
            print("the showdown code is broken!")
            for i in check["responses"]:
                print(i)

    open("../tests/test.html", "w").write(build_testpage(readablejs_path))
    open("../tests/test_min.html", "w").write(build_testpage(minifiedjs_path))