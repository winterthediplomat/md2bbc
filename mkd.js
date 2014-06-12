//
// Showdown usage:
//

conv_opts = {
	multiline_quoting: false,
	check_quotes_into_lists: false,
	recognize_bbcode: false,
	enable_autolinking: false
};

var togglemultiline = function(){
	conv_opts.multiline_quoting = !conv_opts.multiline_quoting;
	console.log("(un)checked, now ", conv_opts);
}

var togglequotesintolists = function(){
	conv_opts.check_quotes_into_lists = !conv_opts.check_quotes_into_lists;
	console.log("(un)checked, now ", conv_opts);
}

var togglebbcode = function(){
	conv_opts.recognize_bbcode = !conv_opts.recognize_bbcode;
	console.log("(un)checked, now ", conv_opts);
}

var toggleautolinking = function(){
	conv_opts.enable_autolinking = !conv_opts.enable_autolinking;
	console.log("(un)checked, now ", conv_opts);
}

var shitconvert=function(){
	console.log("converting with options: ", conv_opts);
	var converter = new Showdown.converter(conv_opts);
	document.getElementById("bb").value=converter.makeBBCode(document.getElementById('md').value);
	return true;
}
