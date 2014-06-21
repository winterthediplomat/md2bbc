//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//
//				A A L
//				T C A
//				T K B
//
//   <http://www.attacklab.net/>
//

//
// Wherever possible, Showdown is a straight, line-by-line port
// of the Perl version of Markdown.
//
// This is not a normal parser design; it's basically just a
// series of string substitutions.  It's hard to read and
// maintain this way,  but keeping Showdown close to the original
// design makes it easier to port new features.
//
// More importantly, Showdown behaves like markdown.pl in most
// edge cases.  So web applications can do client-side preview
// in Javascript, and then build identical HTML on the server.
//
// This port needs the new RegExp functionality of ECMA 262,
// 3rd Edition (i.e. Javascript 1.5).  Most modern web browsers
// should do fine.  Even with the new regular expression features,
// We do a lot of work to emulate Perl's regex functionality.
// The tricky changes in this file mostly have the "attacklab:"
// label.  Major or self-explanatory changes don't.
//
// Smart diff tools like Araxis Merge will be able to match up
// this file with markdown.pl in a useful way.  A little tweaking
// helps: in a copy of markdown.pl, replace "#" with "//" and
// replace "$text" with "text".  Be sure to ignore whitespace
// and line endings.
//


//
// Showdown usage:
//
//   var text = "Markdown *rocks*.";
//
//   var converter = new Showdown.converter();
//   var html = converter.makeBBCode(text);
//
//   alert(html);
//
// Note: move the sample code to the bottom of this
// file before uncommenting it.
//


//
// Showdown namespace
//
var Showdown = { extensions: {} };

//
// forEach
//
var forEach = Showdown.forEach = function(obj, callback) {
	if (typeof obj.forEach === 'function') {
		obj.forEach(callback);
	} else {
		var i, len = obj.length;
		for (i = 0; i < len; i++) {
			callback(obj[i], i, obj);
		}
	}
};

//
// Standard extension naming
//
var stdExtName = function(s) {
	return s.replace(/[_-]||\s/g, '').toLowerCase();
};

//
// converter
//
// Wraps all "globals" so that the only thing
// exposed is makeBBCode().
//
Showdown.converter = function(converter_options) {

//
// Globals:
//

//giving a default for converter_options
converter_options = converter_options || {};

// Global hashes, used by various utility routines
var g_urls;
var g_titles;
var g_html_blocks;
var g_html_spans;


// Used to track when we're inside an ordered or unordered list
// (see _ProcessListItems() for details):
var g_list_level = 0;

// Global extensions
var g_lang_extensions = [ // extensions are bad for your health , don't use them
	//[url]
	/*{
		type:'lang',
		regex: /\[url(\=(.*))?\](.*)\[\/url\]/g,
		replace: function(wholematch, goturl, url, content){
			//console.log("[lang_extension::noshitsherlock] wholematch", wholematch);
			//console.log("[lang_extension::noshitsherlock] content", content);
			if (converter_options.recognize_bbcode)
				wholematch = wholematch.replace(/\>/g, "&gt;").replace(/\</g, "&lt;");
			if (converter_options.enable_autolinking)
				wholematch = wholematch.replace(/^(https?|ftpe?s?):\/\/(\w+\.)+[a-z]+\/?([^'">\s]+)*$/g,
						function(url){return url.replace(/\/\//, "\\\\")});
			return wholematch;
		}
	}*/
];

var g_output_modifiers = [
	//setting &gt; and &lt; as > and <
	{
		type: "lang",
		regex: "&gt;",
		replace: function(match){
			return ">";
		}
	},
	{
		type: "lang",
		regex: "&lt;",
		replace: function(match){
			return "<";
		}
	},
	//these are added only when recognize_bbcode is set to true.
	/*{
		type: "lang",
		regex: "~S",
		replace: function(match){
			return "*";
		}
	},
	{
		type: "lang",
		regex: "~U",
		replace: function(match){
			return "_";
		}
	},*/
	//this are set only when enable_autolinking is set to true
	{
		type: "lang",
		regex: /^(https?|ftpe?s?):\\\\(\w+\.)+[a-z]+\/?([^'">\s]+)*$/g,
		replace: function(match){
			return match.replace(/\\\\/, "//");
		}
	}
];


//
// Automatic Extension Loading (node only):
//

if (typeof module !== 'undefined' && typeof exports !== 'undefined' && typeof require !== 'undefind') {
	var fs = require('fs');

	if (fs) {
		// Search extensions folder
		var extensions = fs.readdirSync((__dirname || '.')+'/extensions').filter(function(file){
			return ~file.indexOf('.js');
		}).map(function(file){
			return file.replace(/\.js$/, '');
		});
		// Load extensions into Showdown namespace
		Showdown.forEach(extensions, function(ext){
			var name = stdExtName(ext);
			Showdown.extensions[name] = require('./extensions/' + ext);
		});
	}
}

//this.makeHtml = function(text) {
this.makeBBCode = function(text) {
//
// Main function. The order in which other subs are called here is
// essential. Link and image substitutions need to happen before
// _EscapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
// and <img> tags get encoded.
//

	// Clear the global hashes. If we don't clear these, you get conflicts
	// from other articles when generating a page which contains more than
	// one article (e.g. an index page that shows the N most recent
	// articles):
	g_urls = {};
	g_titles = {};
	g_html_blocks = [];
	g_html_spans = [];

	// attacklab: Replace ~ with ~T
	// This lets us use tilde as an escape char to avoid md5 hashes
	// The choice of character is arbitray; anything that isn't
	// magic in Markdown will work.
	text = text.replace(/~/g,"~T");

	// attacklab: Replace $ with ~D
	// RegExp interprets $ as a special character
	// when it's in a replacement string
	text = text.replace(/\$/g,"~D");

	// Standardize line endings
	text = text.replace(/\r\n/g,"\n"); // DOS to Unix
	text = text.replace(/\r/g,"\n"); // Mac to Unix

	// Make sure text begins and ends with a couple of newlines:
	text = "\n\n" + text + "\n\n";

	// Convert all tabs to spaces.
	text = _Detab(text);

	// Strip any lines consisting only of spaces and tabs.
	// This makes subsequent regexen easier to write, because we can
	// match consecutive blank lines with /\n+/ instead of something
	// contorted like /[ \t]*\n+/ .
	text = text.replace(/^[ \t]+$/mg,"");

	// Run language extensions
	Showdown.forEach(g_lang_extensions, function(x){
		text = _ExecuteExtension(x, text);
	});


	// Handle github codeblocks prior to running HashHTML so that
	// HTML contained within the codeblock gets escaped propertly
	text = _DoGithubCodeBlocks(text);


	// Turn inline BBCode elements into hash entries
	text = _HashBBCodeSpans(text);
	// Turn block-level BBCode blocks into hash entries
	text = _HashBBCodeBlocks(text);
	// Strip link definitions, store in hashes.
	text = _StripLinkDefinitions(text);

	text = _RunBlockGamut(text);

	text = _UnescapeSpecialChars(text);

	// attacklab: Restore dollar signs
	text = text.replace(/~D/g,"$$");

	// attacklab: Restore tildes
	text = text.replace(/~T/g,"~");

	// Run output modifiers
	Showdown.forEach(g_output_modifiers, function(x){
		text = _ExecuteExtension(x, text);
	});

	return text;
};

//
// Options:
//

// Parse extensions options into separate arrays
if (converter_options && converter_options.extensions) {

  var self = this;

	// Iterate over each plugin
	Showdown.forEach(converter_options.extensions, function(plugin){

		// Assume it's a bundled plugin if a string is given
		if (typeof plugin === 'string') {
			plugin = Showdown.extensions[stdExtName(plugin)];
		}

		if (typeof plugin === 'function') {
			// Iterate over each extension within that plugin
			Showdown.forEach(plugin(self), function(ext){
				// Sort extensions by type
				if (ext.type) {
					if (ext.type === 'language' || ext.type === 'lang') {
						g_lang_extensions.push(ext);
					} else if (ext.type === 'output' || ext.type === 'html') {
						g_output_modifiers.push(ext);
					}
				} else {
					// Assume language extension
					g_output_modifiers.push(ext);
				}
			});
		} else {
			throw "Extension '" + plugin + "' could not be loaded.  It was either not found or is not a valid extension.";
		}
	});
}


var _ExecuteExtension = function(ext, text) {
	if (ext.regex) {
		try{
			var re = new RegExp(ext.regex, 'g');
		}catch(TypeError){ //ext.regex is a regex, can't supply flags
			var re = ext.regex;
		}
		return text.replace(re, ext.replace);
	} else if (ext.filter) {
		return ext.filter(text);
	}
};

var _StripLinkDefinitions = function(text) {
//
// Strips link definitions from text, stores the URLs and titles in
// hash references.
//

	// Link defs are in the form: ^[id]: url "optional title"

	/*
		var text = text.replace(/
				^[ ]{0,3}\[(.+)\]:  // id = $1  attacklab: g_tab_width - 1
				  [ \t]*
				  \n?				// maybe *one* newline
				  [ \t]*
				<?(\S+?)>?			// url = $2
				  [ \t]*
				  \n?				// maybe one newline
				  [ \t]*
				(?:
				  (\n*)				// any lines skipped = $3 attacklab: lookbehind removed
				  ["(]
				  (.+?)				// title = $4
				  [")]
				  [ \t]*
				)?					// title is optional
				(?:\n+|$)
			  /gm,
			  function(){...});
	*/

	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|(?=~0))/gm,
		function (wholeMatch,m1,m2,m3,m4) {
			m1 = m1.toLowerCase();
			g_urls[m1] = _EncodeAmpsAndAngles(m2);  // Link IDs are case-insensitive
			if (m3) {
				// Oops, found blank lines, so it's not a title.
				// Put back the parenthetical statement we stole.
				return m3+m4;
			} else if (m4) {
				g_titles[m1] = m4.replace(/"/g,"&quot;");
			}

			// Completely remove the definition from the text
			return "";
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}


var _HashBBCodeBlocks = function(text) {
	// attacklab: Double up blank lines to reduce lookaround
	text = text.replace(/\n/g,"\n\n");

	// Hashify some BBCode block tags:
	// Some BBCode tags, like [math]/[m], may contain characters like aterisks
	// and underscores that are going to cause conflicts and problems.
	// eg:
	//     [math]\sqrt-1 * \frac{5}{b*2*3}-q_a_d[/math]
	// is usually converted into:
	//     [math]\sqrt-1 * \frac{5}{b[cur]2[/cur]3}-q[cur]a[/cur]d[/math]
	// which is wrong.

	// attacklab: This regex can be expensive when it fails.
	/*
		var text = text.replace(/
		(						// save in $1
			\[($block_tags_a)	// start tag = $2
			\b					// word break
			[^\r]*?\n			// any number of lines, lazy matching
			\[/\2\]				// the matching end tag
		)
		/g,hashElement;
	*/
	text = text.replace(/(\[(math|code)\b[^\r]*?\[\/\2\])/g,hashElement);

	// attacklab: Undo double lines (see comment at top of this function)
	text = text.replace(/\n\n/g,"\n");
	return text;
}

var hashElement = function(wholeMatch,m1) {
	var blockText = m1;

	// Undo double lines
	blockText = blockText.replace(/\n\n/g,"\n");
	blockText = blockText.replace(/^\n/,"");

	// strip trailing blank lines
	blockText = blockText.replace(/\n+$/g,"");

	// Replace the element text with a marker ("~KxK" where x is its key)
	blockText = "\n\n~K" + (g_html_blocks.push(blockText)-1) + "K\n\n";

	return blockText;
};

var _HashBBCodeSpans = function(text) {
	// Hashify some BBCode inline tags
	text = text.replace(/(\[(m|img)\b[^\r]*?\[\/\2\])/g,hashSpanElement);

	return text;
}

var hashSpanElement = function(wholeMatch,m1) {
	var blockText = m1;

	// trim leadin/trailing blank lines
	blockText = blockText.replace(/^\n+|\n+$/g,"");

	// Replace the element text with a marker ("~SxS" where x is its key)
	blockText = "~S" + (g_html_spans.push(blockText)-1) + "S";

	return blockText;
};

var _RunBlockGamut = function(text) {
//
// These are all the transformations that form block-level
// tags like paragraphs, headers, and list items.
//
	text = _DoHeaders(text);

	// Do Horizontal Rules:
	var key = hashBlock("[hr /]");
	text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);
	text = text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);

	text = _DoLists(text);
	text = _DoCodeBlocks(text);
	text = _DoBlockQuotes(text);

	// We already ran _HashBBCodeBlocks() before, in Markdown(), but that
	// was to escape raw HTML in the original Markdown source. This time,
	// we're escaping the markup we've just created, so that we don't wrap
	// <p> tags around block-level tags.
	text = _HashBBCodeBlocks(text);
	text = _FormParagraphs(text);

	return text;
};


var _RunSpanGamut = function(text) {
//
// These are all the transformations that occur *within* block-level
// tags like paragraphs, headers, and list items.
//

	text = _DoCodeSpans(text);
	text = _EscapeSpecialCharsWithinTagAttributes(text);
	text = _EscapeSpecialTagsContent(text);
	text = _EncodeBackslashEscapes(text);

	// Process anchor and image tags. Images must come first,
	// because ![foo][f] looks like an anchor.
	text = _DoImages(text);
	text = _DoAnchors(text);


	// Make links out of things like `<http://example.com/>`
	// Must come after _DoAnchors(), because you can use < and >
	// delimiters in inline links like [this](<url>).
	text = _DoAutoLinks(text);
	text = _EncodeAmpsAndAngles(text);
	text = _DoItalicsAndBold(text);
	// Custom handlers
	text = _DoUrlRecognition(text);
	text = _DoStrikes(text);
	text = _DoUsers(text);
	text = _DoProjects(text);

	// Do hard breaks:
	//not anymore. text = text.replace(/  +\n/g," <br />\n");

	return text;
}

var _EscapeSpecialCharsWithinTagAttributes = function(text) {
//
// Within tags -- meaning between < and > -- encode [\ ` * _] so they
// don't conflict with their use in Markdown for code, italics and strong.
//

	// Build a regex to find HTML tags and comments.  See Friedl's
	// "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
	var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

	text = text.replace(regex, function(wholeMatch) {
		var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");
		tag = escapeCharacters(tag,"\\`*_");
		return tag;
	});

	return text;
}

var _EscapeSpecialTagsContent = function(text) {
//
// Escape some characters within specified tags in order to prevent
// unwanted results from happening.
//

	// Escape '<' within urls text value to avoid urls within urls
	text = text.replace(/\[url(="?[^"]+?"?)\](.+?)\[\/url\]/, function(wholeMatch) {
		return escapeCharacters(wholeMatch,"<");
	});

	return text;
}

var _DoAnchors = function(text) {
//
// Turn Markdown link shortcuts into XHTML <a> tags.
//
	//
	// First, handle reference-style links: [link text] [id]
	//

	/*
		text = text.replace(/
		(							// wrap whole match in $1
			\[
			(
				(?:
					\[[^\]]*\]		// allow brackets nested one level
					|
					[^\[]			// or anything else
				)*
			)
			\]

			[ ]?					// one optional space
			(?:\n[ ]*)?				// one optional newline followed by spaces

			\[
			(.*?)					// id = $3
			\]
		)()()()()					// pad remaining backreferences
		/g,_DoAnchors_callback);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()/g,writeAnchorTag);

	//
	// Next, inline-style links: [link text](url "optional title")
	//

	/*
		text = text.replace(/
			(						// wrap whole match in $1
				\[
				(
					(?:
						\[[^\]]*\]	// allow brackets nested one level
					|
					[^\[\]]			// or anything else
				)
			)
			\]
			\(						// literal paren
			[ \t]*
			()						// no id, so leave $3 empty
			<?(.*?)>?				// href = $4
			[ \t]*
			(?:
				(['"])				// quote char = $5
				(.*?)				// Title = $6
				\5					// matching quote
				[ \t]*				// ignore any spaces/tabs between closing quote and )
			)?						// title is optional
			\)
		)
		/g,writeAnchorTag);
	*/
	text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?(?:\(.*?\).*?)?)>?[ \t]*(?:(['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);

	//
	// Last, handle reference-style shortcuts: [link text]
	// These must come last in case you've also got [link test][1]
	// or [link test](/foo)
	//

	/*
		text = text.replace(/
		(		 					// wrap whole match in $1
			\[
			([^\[\]]+)				// link text = $2; can't contain '[' or ']'
			\]
		)()()()()					// pad rest of backreferences
		/g, writeAnchorTag);
	*/
	text = text.replace(/(\[([^\[\]]+)\])()()()()/g, writeAnchorTag);

	return text;
}

var writeAnchorTag = function(wholeMatch,m1,m2,m3,m4,m5,m6) {
	if (m6 == undefined) m6 = "";
	var whole_match = m1;
	var link_text   = m2;
	var link_id     = m3.toLowerCase();
	var url         = m4;
	var title       = m6;

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = link_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			if (whole_match.search(/\(\s*\)$/m)>-1) {
				// Special case for explicit empty url
				url = "";
			} else {
				return whole_match;
			}
		}
	}
	//fix a weird bug: (.*)[/code] -> [url=.*]/code[/url]
	//if the url is not a real url, we don't have to enclose it into tags
	else if(! /^(https?|ftpe?s?):\/\/(\w+\.)+[a-z]+\/?([^'">\s]+)*$/.test(url))
		return whole_match;

	url = escapeCharacters(url,"*_");
	//orig: var result = "<a href=\"" + url + "\"";
	//if (title != "") {
	//	title = title.replace(/"/g,"&quot;");
	//	title = escapeCharacters(title,"*_");
	//	result +=  " title=\"" + title + "\"";
	//}

	return _BuildURL(url, link_text);
}


var _DoUrlRecognition = function(text){
	if(converter_options && converter_options.enable_autolinking)
		return text.replace(/(^|\s)((https?|ftpe?s?|dict):\/\/(\w+\.)+[a-z]+\/?([^'">\s]+)*)(\s|$)/gi,
			function(wholestring, start_, url, args){
				console.log("[_DoUrlRecognition]", wholestring, start_, url, args);
				return start_+"[url]"+url+"[/url]"+(wholestring.match(" $")?" ":"");
			}
		);
	else
		return text;
}

var _DoAutoLinks = function(text) {

	text = text.replace(/<((https?|ftpe?s?|dict):\/\/(\w+\.)+[a-z]+\/?([^'">\s]+)*)>/gi, // old: /<((https?|ftp|dict):[^'">\s]+)>/gi
		function(wholeMatch, url) {
			return _BuildURL(url, "");
		});

	// Email addresses: <address@domain.foo>

	/*
		text = text.replace(/
			<
			(?:mailto:)?
			(
				[-.\w]+
				\@
				[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+
			)
			>
		/gi, _DoAutoLinks_callback());
	*/
	text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
		function(wholeMatch,m1) {
			return _EncodeEmailAddress( _UnescapeSpecialChars(m1) );
		}
	);

	return text;
}

var _BuildURL = function(url, text){
	console.log("[_BuildURL] url: "+url+" text: "+text);
	var match;
	// Gist
	if (match = url.match(/https?\:\/\/gist\.github\.com\/\w+\/(\w+)/))
		return "[gist]" + match[1] + "[/gist]";
	// Wikipedia article
	else if (match = url.match(/https?:\/\/(\w\w)\.wikipedia.org\/wiki\/(.+)/))
		return "[wiki=" + match[1] + "]" + match[2].replace (/~E95E/g," ") + "[/wiki]";
	// Twitter
	else if (match = url.match(/https?:\/\/twitter\.com\/[^\/]+\/status\/([0-9]+)/))
		return "[twitter]" + match[1] + "[/twitter]";
	// YouTube, Facebook, Dailymotion, Vimeo
	else if (match = (url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch(?:\?v=|\?.+?&v=)|youtu\.be\/)[a-zA-Z0-9_-~]+/) ||
					  url.match(/https?:\/\/(?:www\.)?facebook\.com\/photo\.php(?:\?v=|\?.+?&v=)\d+/) ||
					  url.match(/https?:\/\/(?:www\.)?(?:dai\.ly\/|dailymotion\.com\/(?:.+?video=|(?:video|hub)\/))[a-z0-9]+/) ||
					  url.match(/https?:\/\/(?:www\.)?vimeo\.com.+?\d+/)))
		return "[video]" + match[0] + "[/video]";
	// Spotify
	else if (match = url.match(/^https?:\/\/(?:open|play)\.spotify\.com\/track\/([\w\d]+)$/))
		return "[music]spotify:track:" + match[1] + "[/music]";
	// Soundcloud, Deezer
	else if (match = (url.match (/https?:\/\/soundcloud\.com\/\S+\/\S+/) ||
					  url.match (/https?:\/\/(?:www\.)?deezer\.com\/(track|album|playlist)\/(\d+)/)))
		return "[music]" + match[0] + "[/music]";
	// Url without text (no hyperlinked text)
	else if (text == "")
		return "[url]" + url + "[/url]";
	else
		return "[url=" + url + "]" + text + "[/url]";
}

var _DoImages = function(text) {
//
// Turn Markdown image shortcuts into <img> tags.
//

	//
	// First, handle reference-style labeled images: ![alt text][id]
	//

	/*
		text = text.replace(/
		(						// wrap whole match in $1
			!\[
			(.*?)				// alt text = $2
			\]

			[ ]?				// one optional space
			(?:\n[ ]*)?			// one optional newline followed by spaces

			\[
			(.*?)				// id = $3
			\]
		)()()()					// pad rest of backreferences
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()/g,writeImageTag);

	//
	// Next, handle inline images:  ![alt text](url "optional title")
	// Don't forget: encode * and _

	/*
		text = text.replace(/
		(						// wrap whole match in $1
			!\[
			(.*?)				// alt text = $2
			\]
			\s?					// One optional whitespace character
			\(					// literal paren
			[ \t]*
			()					// no id, so leave $3 empty
			<?(\S+?)>?			// src url = $4
			[ \t]*
			(?:
				(['"])			// quote char = $5
				(.*?)			// title = $6
				\5				// matching quote
				[ \t]*
			)?					// title is optional
		\)
		)
		/g,writeImageTag);
	*/
	text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?((?:ht|f)tps?:\/\/(?:\w+\.)\S+)>?[ \t]*(?:(['"])(.*?)\5[ \t]*)?\))/g,writeImageTag);

	return text;
}

var writeImageTag = function(wholeMatch,m1,m2,m3,m4,m5,m6) {
	var whole_match = m1;
	var alt_text    = m2;
	var link_id     = m3.toLowerCase();
	var url         = m4;
	var title       = m6;

	if (!title) title = "";

	if (url == "") {
		if (link_id == "") {
			// lower-case and turn embedded newlines into spaces
			link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
		}
		url = "#"+link_id;

		if (g_urls[link_id] != undefined) {
			url = g_urls[link_id];
			if (g_titles[link_id] != undefined) {
				title = g_titles[link_id];
			}
		}
		else {
			return whole_match;
		}
	}

	alt_text = alt_text.replace(/"/g,"&quot;");
	url = escapeCharacters(url,"*_");
	//orig: var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

	// attacklab: Markdown.pl adds empty title attributes to images.
	// Replicate this bug.

	//if (title != "") {
	//	title = title.replace(/"/g,"&quot;");
	//	title = escapeCharacters(title,"*_");
	//	result +=  " title=\"" + title + "\"";
	//}

	//orig: result += " />";
	var result = "[img]"+url+"[/img]";

	return result;
}


var _DoHeaders = function(text) {

	// Setext-style headers:
	//	Header 1
	//	========
	//
	//	Header 2
	//	--------
	//
	text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
		//function(wholeMatch,m1){return hashBlock('<h1 id="' + headerId(m1) + '">' + _RunSpanGamut(m1) + "</h1>");});
		function(wholeMatch, m1){return hashBlock("[big]"+_RunSpanGamut(m1)+"[/big]");});

	text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
		//function(matchFound,m1){return hashBlock('<h2 id="' + headerId(m1) + '">' + _RunSpanGamut(m1) + "</h2>");});
		function(matchFound, m1){return hashBlock("[big]"+_RunSpanGamut(m1)+"[/big]");});

	// atx-style headers:
	//  # Header 1
	//  ## Header 2
	//  ## Header 2 with closing hashes ##
	//  ...
	//  ###### Header 6
	//

	/*
		text = text.replace(/
			^(\#{1,6})				// $1 = string of #'s
			[ \t]*
			(.+?)					// $2 = Header text
			[ \t]*
			\#*						// optional closing #'s (not counted)
			\n+
		/gm, function() {...});
	*/

	text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
		function(wholeMatch,m1,m2) {
			var h_level = m1.length;
			//return hashBlock("<h" + h_level + ' id="' + headerId(m2) + '">' + _RunSpanGamut(m2) + "</h" + h_level + ">");
			if(h_level>3) //1,2 => [big], 3 => [small]
				return hashBlock(_RunSpanGamut(m2));
			else if(h_level == 3)
				return hashBlock("[small]"+_RunSpanGamut(m2)+"[/small]");
			else //h_level won't be negative
				return hashBlock("[big]"+_RunSpanGamut(m2)+"[/big]");
		});

	function headerId(m) {
		return m.replace(/[^\w]/g, '').toLowerCase();
	}
	return text;
}

// This declaration keeps Dojo compressor from outputting garbage:
var _ProcessListItems;

var _DoLists = function(text) {
//
// Form HTML ordered (numbered) and unordered (bulleted) lists.
//

	// attacklab: add sentinel to hack around khtml/safari bug:
	// http://bugs.webkit.org/show_bug.cgi?id=11231
	text += "~0";

	// Re-usable pattern to match any entirel ul or ol list:

	/*
		var whole_list = /
		(									// $1 = whole list
			(								// $2
				[ ]{0,3}					// attacklab: g_tab_width - 1
				([*+-]|\d+[.])				// $3 = first list item marker
				[ \t]+
			)
			[^\r]+?
			(								// $4
				~0							// sentinel for workaround; should be $
			|
				\n{2,}
				(?=\S)
				(?!							// Negative lookahead for another list item marker
					[ \t]*
					(?:[*+-]|\d+[.])[ \t]+
				)
			)
		)/g
	*/
	var whole_list = /^(([ ]{0,3}([*+-]|[a-zA-Z\d]+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|[a-zA-Z\d]+[.])[ \t]+)))/gm;

	if (g_list_level) {
		text = text.replace(whole_list,function(wholeMatch,m1,m2,m3) {
			var list = m1;
			var ordered_list = (/[*+-]/g.test(m2) ? 0 : 1); // 0 > unordered list; 1 > ordered list

			var list_type,
			    list_start;

			if (/\d+/.test(m3)) {
				list_type = "1";
				list_start = /\d+/.exec(m3);
			}
			else if (/[iI]+/.test(m3)) {
				list_type = /[iI]/.exec(m3);
				list_start = m3.match(/[iI]/g).length;
			}
			else if (/[a-zA-Z]/.test(m3)) {
				list_type = (m3 === m3.toLowerCase()) ? "a" : "A";
				list_start = m3.toLowerCase().charCodeAt(0) - 96;
			}

			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _ProcessListItems(list);

			// Trim any trailing whitespace, to put the closing `</$list_type>`
			// up on the preceding line, to get it past the current stupid
			// HTML block parser. This is a hack to work around the terrible
			// hack that is the HTML block parser.
			result = result.replace(/\s+$/,"");
			console.log("[_DoLists]g_list_level, result: ", result);
			result = "[list" + (ordered_list ? " type=\"" + list_type + "\" start=\"" + list_start + "\"" : "") + "]\n" + result + "[/list]\n";

			return result;
		});
	} else {
		whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|[a-zA-Z\d]+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|[a-zA-Z\d]+[.])[ \t]+)))/g;
		text = text.replace(whole_list,function(wholeMatch,m1,m2,m3,m4) {
			var runup = m1;
			var list = m2;
			var ordered_list = (/[*+-]/g.test(m3) ? 0 : 1); // 0 > unordered list; 1 > ordered list

			var list_type,
			    list_start;

			if (/\d+/.test(m4)) {
				list_type = "1";
				list_start = /\d+/.exec(m4);
			}
			else if (/[iI]+/.test(m4)) {
				list_type = /[iI]/.exec(m4);
				list_start = m4.match(/[iI]/g).length;
			}
			else if (/[a-zA-Z]/.test(m4)) {
				list_type = (m4 === m4.toLowerCase()) ? "a" : "A";
				list_start = m4.toLowerCase().charCodeAt(0) - 96;
			}

			// Turn double returns into triple returns, so that we can make a
			// paragraph for the last item in a list, if necessary:
			var list = list.replace(/\n{2,}/g,"\n\n\n");;
			var result = _ProcessListItems(list);
			//result = runup + "<"+list_type+">\n" + result + "</"+list_type+">\n";
			console.log("[_DoLists]result: " + result);
			//result = result.split("\n").map(function(item){return "[\\*] "+item+"\n";}).join("");
			//console.log("[_DoLists]result after treatment: "+result);
			result = "[list" + (ordered_list ? " type=\"" + list_type + "\" start=\"" + list_start + "\"" : "") + "]\n" + result + "[/list]\n";

			return result;
		});
	}

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

_ProcessListItems = function(list_str) {
//
//  Process the contents of a single ordered or unordered list, splitting it
//  into individual list items.
//
	// The $g_list_level global keeps track of when we're inside a list.
	// Each time we enter a list, we increment it; when we leave a list,
	// we decrement. If it's zero, we're not in a list anymore.
	//
	// We do this because when we're not inside a list, we want to treat
	// something like this:
	//
	//    I recommend upgrading to version
	//    8. Oops, now this line is treated
	//    as a sub-list.
	//
	// As a single paragraph, despite the fact that the second line starts
	// with a digit-period-space sequence.
	//
	// Whereas when we're inside a list (or sub-list), that line will be
	// treated as the start of a sub-list. What a kludge, huh? This is
	// an aspect of Markdown's syntax that's hard to parse perfectly
	// without resorting to mind-reading. Perhaps the solution is to
	// change the syntax rules such that sub-lists must start with a
	// starting cardinal number; e.g. "1." or "a.".

	g_list_level++;

	// trim trailing blank lines:
	list_str = list_str.replace(/\n{2,}$/,"\n");

	// attacklab: add sentinel to emulate \z
	list_str += "~0";

	/*
		list_str = list_str.replace(/
			(\n)?							// leading line = $1
			(^[ \t]*)						// leading whitespace = $2
			([*+-]|\d+[.]) [ \t]+			// list marker = $3
			([^\r]+?						// list item text   = $4
			(\n{1,2}))
			(?= \n* (~0 | \2 ([*+-]|\d+[.]) [ \t]+))
		/gm, function(){...});
	*/
	list_str = list_str.replace(/(\n)?(^[ \t]*)([*+-]|[a-zA-Z\d]+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|[a-zA-Z\d]+[.])[ \t]+))/gm,
		function(wholeMatch,m1,m2,m3,m4){
			var item = m4;
			var leading_line = m1;
			var leading_space = m2;

			//handle the quotes into lists in the "sane" way, but only if requested.
			if (leading_line || (item.search(/\n{2,}/)>-1) || (converter_options && converter_options.check_quotes_into_lists) ) {
				item = _RunBlockGamut(_Outdent(item));
			}
			else {
				// Recursion for sub-lists:
				item = _DoLists(_Outdent(item));
				item = item.replace(/\n$/,""); // chomp(item)
				item = _RunSpanGamut(item);
			}


			//return  "<li>" + item + "</li>\n";
			console.log('[_ProcessListItems] item: '+item);
			return "[*] "+item+"\n";
		}
	);

	// attacklab: strip sentinel
	list_str = list_str.replace(/~0/g,"");

	g_list_level--;
	return list_str;
}


var _DoCodeBlocks = function(text) {
//
//  Process Markdown `<pre><code>` blocks.
//

	/*
		text = text.replace(text,
			/(?:\n\n|^)
			(								// $1 = the code block -- one or more lines, starting with a space/tab
				(?:
					(?:[ ]{4}|\t)			// Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
					.*\n+
				)+
			)
			(\n*[ ]{0,3}[^ \t\n]|(?=~0))	// attacklab: g_tab_width
		/g,function(){...});
	*/

	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
		function(wholeMatch,m1,m2) {
			var codeblock = m1;
			var nextChar = m2;

			codeblock = _EncodeCode( _Outdent(codeblock));
			codeblock = _Detab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			//original: codeblock = "<pre><code>" + codeblock + "\n</code></pre>";
			codeblock = "[code]"+codeblock+"[/code]";
			return hashBlock(codeblock) + nextChar;
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
};

var _DoGithubCodeBlocks = function(text) {
//
//  Process Github-style code blocks
//  Example:
//  ```ruby
//  def hello_world(x)
//    puts "Hello, #{x}"
//  end
//  ```
//


	// attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
	text += "~0";

	text = text.replace(///(?:^|\n)```(.*)\n([\s\S]*?)\n```/g,
		//we need some code inside triple backticks
		// /(?:^|\n)```(.*)\n([\s\S]+?)\n```/g, 
		/(?:^|\n)```(.*)\n([\s\S]+?)\n```(\n|$)/g,
		function(wholeMatch,m1,m2) {
			console.log("[_DoGithubCodeBlocks] opening a code block, codeblock: ", m2);

			var language = m1;
			var codeblock = m2;

			codeblock = _EncodeCode(codeblock);
			codeblock = _Detab(codeblock);
			codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
			codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

			//codeblock = "<pre><code" + (language ? " class=\"" + language + '"' : "") + ">" + codeblock + "\n</code></pre>";
			//codeblock = hashBlock(codeblock);
			codeblock = "[code"+(language? "="+language : "")+"]\n"+codeblock+"\n[/code]";

			return hashBlock(codeblock); //codeblock;
		}
	);

	// attacklab: strip sentinel
	text = text.replace(/~0/,"");

	return text;
}

var hashBlock = function(text) {
	text = text.replace(/(^\n+|\n+$)/g,"");
	return "\n\n~K" + (g_html_blocks.push(text)-1) + "K\n\n";
}

var _DoCodeSpans = function(text) {
//
//   *  Backtick quotes are used for <code></code> spans.
//
//   *  You can use multiple backticks as the delimiters if you want to
//	 include literal backticks in the code span. So, this input:
//
//		 Just type ``foo `bar` baz`` at the prompt.
//
//	   Will translate to:
//
//		 <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
//
//	There's no arbitrary limit to the number of backticks you
//	can use as delimters. If you need three consecutive backticks
//	in your code, use four for delimiters, etc.
//
//  *  You can use spaces to get literal backticks at the edges:
//
//		 ... type `` `bar` `` ...
//
//	   Turns to:
//
//		 ... type <code>`bar`</code> ...
//

	/*
		text = text.replace(/
			(^|[^\\])					// Character before opening ` can't be a backslash
			(`+)						// $2 = Opening run of `
			(							// $3 = The code block
				[^\r]*?
				[^`]					// attacklab: work around lack of lookbehind
			)
			\2							// Matching closer
			(?!`)
		/gm, function(){...});
	*/

	text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
		function(wholeMatch,m1,m2,m3,m4) {
			var c = m3;
			c = c.replace(/^([ \t]*)/g,"");	// leading whitespace
			c = c.replace(/[ \t]*$/g,"");	// trailing whitespace
			c = _EncodeCode(c);
			//return m1+"<code>"+c+"</code>";
			return m1+"[code]"+c+"[/code]";
		});

	return text;
}

var _EncodeCode = function(text) {
//
// Encode/escape certain characters inside Markdown code runs.
// The point is that in code, these characters are literals,
// and lose their special Markdown meanings.
//
	// Encode all ampersands; HTML entities are not
	// entities within a Markdown code span.
	text = text.replace(/&/g,"&amp;");

	// Do the angle bracket song and dance:
	text = text.replace(/</g,"&lt;");
	text = text.replace(/>/g,"&gt;");

	// Now, escape characters that are magic in Markdown:
	text = escapeCharacters(text,"\*_{}[]\\@#`~",false);

// jj the line above breaks this:
//---

//* Item

//   1. Subitem

//            special char: *
//---

	return text;
}


var _DoItalicsAndBold = function(text) {

	// <strong> must go first:
	console.log("[_DoItalicsAndBold]: text="+text);
	text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
		//"<strong>$2</strong>");
		"[b]$2[/b]");

	text = text.replace(///(\*|_)(?=\S)([^\r]*?\S)\1/g,
		//now it shouldn't match [*] (lists points)
		/(\*|_)(?=\S)([^\]\r]*?\S)\1/g,
		//"<em>$2</em>");
		"[cur]$2[/cur]");

	return text;
}


var _DoBlockQuotes = function(text) {

	/*
		text = text.replace(/
		(								// Wrap whole match in $1
			(
				^[ \t]*>[ \t]?			// '>' at the start of a line
				.+\n					// rest of the first line
				(.+\n)*					// subsequent consecutive lines
				\n*						// blanks
			)+
		)
		/gm, function(){...});
	*/

	text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
		function(wholeMatch,m1) {
			var bq = m1;

			//alfateam123/md2bbc/issues/2
			var multiline_triggered = false;
			var quoted_lines = [];
			if(converter_options && converter_options.multiline_quoting == true){
				//retrieving the indexes of lines starting with >
				quoted_lines = bq.split("\n").map(
						function(line, index){return (line.match(/^\>/))?index:-1}
					).filter(function(line, index){return index!=-1;});
				//checking if there are at least two consecutive lines starting with >.
				//if so, trigger 4chan-style quoting 
				multiline_triggered = (function(array){
					if(array.length < 2) return false;
					return (array[0]==0 && array[1]==1);
				})(quoted_lines);
				//console.log("[_DoBlockQuotes] quoted_lines: ", quoted_lines);
				//console.log("[_DoBlockQuotes] multiline_triggered: ", multiline_triggered);
			}

			// attacklab: hack around Konqueror 3.5.4 bug:
			// "----------bug".replace(/^-/g,"") == "bug"
			bq = bq.replace(/^[ \t]*>[ \t]?/gm,"~0");	// trim one level of quoting

			// attacklab: clean up hack
			bq = bq.replace(/~0/g,"");

			bq = bq.replace(/^[ \t]+$/gm,"");		// trim whitespace-only lines
			bq = _RunBlockGamut(bq);				// recurse

			bq = bq.replace(/(^|\n)/g,"$1  ");
			// These leading spaces screw with <pre> content, so we need to fix that:
			bq = bq.replace(
					/(\s*<pre>[^\r]+?<\/pre>)/gm,
				function(wholeMatch,m1) {
					var pre = m1;
					// attacklab: hack around Konqueror 3.5.4 bug:
					pre = pre.replace(/^  /mg,"~0");
					pre = pre.replace(/~0/g,"");
					return pre;
				});
			//<alchimist> it would be nice if you remove these leading spaces in the quotes
			bq=bq.split("\n").map(function(line){ return line.replace(/^ +/g, ""); }).join("\n"); 
			
			if(multiline_triggered){
				var temp_bq = bq, into_quotes = false;
				bq = "";
				temp_bq.split("\n").map(
						function(line, index){
							if(quoted_lines.indexOf(index)>-1){
								//if we've already opened a [quote] block, we don't need a new one.
								if(into_quotes)
									bq += line+"\n";
								else{
									into_quotes = true;
									bq += "[quote]"+line+"\n";
								}
							}
							else{
								//if we were writing inside a [quote] block, we need to close if
								if(into_quotes){
									into_quotes = false;
									bq += "[/quote]"+"\n"+line;
								}
								else
									bq += line+"\n";
							}
							return line;
						}
					);
				return bq+(into_quotes?"[/quote]":"")+"\n";
			}
			else{
				//return hashBlock("<blockquote>\n" + bq + "\n</blockquote>");
				return hashBlock("[quote]\n"+bq+"\n[/quote]");
			}
		});
	return text;
}

//
//  Custom Handlers
//
var _DoStrikes = function(text) {
	console.log("[_DoStrikes]: text=" + text);
	text = text.replace(/~T~T(.+)~T~T/g, "[del]$1[/del]")

	return text;
}

var _DoUsers = function(text) {
	console.log("[_DoUsers]: text=" + text);
	text = text.replace(/\B(\\)?@([\S]+)\b/g, function checkAtLeadingSlahes(match, leadingSlash, username) {
		if (leadingSlash === '\\')
			return "@" + username;
		return "[user]" + username + "[/user]";
	});

	return text;
}

var _DoProjects = function(text) {
	console.log("[_DoProjects]: text=" + text);
	text = text.replace(/\B(\\)?#([\S]+)\b/g, function checkDashLeadingSlashes(match, leadingSlash, projectName) {
		if (leadingSlash ==='\\')
			return match;
		return "[project]" + projectName + "[/project]";
	});

	return text;
}
//
//  /Custom handlers
//

var _FormParagraphs = function(text) {
//
//  Params:
//    $text - string to process with html <p> tags
//

	// Strip leading and trailing lines:
	text = text.replace(/^\n+/g,"");
	text = text.replace(/\n+$/g,"");

	var grafs = text.split(/\n{2,}/g);
	var grafsOut = [];

	//
	// Wrap <p> tags.
	//
	var end = grafs.length;
	for (var i=0; i<end; i++) {
		var str = grafs[i];

		// if this is an HTML marker, copy it
		if (str.search(/~K(\d+)K/g) >= 0) {
			grafsOut.push(str);
		}
		else if (str.search(/\S/) >= 0) {
			str = _RunSpanGamut(str);
			str = str.replace(/^([ \t]*)/g,"");
			grafsOut.push(str);
		}

	}

	//
	// Unhashify BBCode blocks and spans
	//
	end = grafsOut.length;
	for (var i=0; i<end; i++) {
		// if this is a marker for an html block...
		while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
			var blockText = g_html_blocks[RegExp.$1];
			blockText = blockText.replace(/\$/g,"$$$$"); // Escape any dollar signs
			grafsOut[i] = grafsOut[i].replace(/~K\d+K/,blockText);
		}

		// if it contains hashed BBCode spans
		while (grafsOut[i].search(/~S(\d+)S/) >= 0) {
			var spanText = g_html_spans[RegExp.$1];
			grafsOut[i] = grafsOut[i].replace(/~S\d+S/, spanText);
		}
	}

	console.log("[_FormParagraphs] grafsOut:", grafsOut);

	return grafsOut.join("\n");
}


var _EncodeAmpsAndAngles = function(text) {
// Smart processing for ampersands and angle brackets that need to be encoded.

	// Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
	//   http://bumppo.net/projects/amputator/
	text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");

	// Encode naked <'s
	text = text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");

	return text;
}


var _EncodeBackslashEscapes = function(text) {
//
//   Parameter:  String.
//   Returns:	The string, with after processing the following backslash
//			   escape sequences.
//

	// attacklab: The polite way to do this is with the new
	// escapeCharacters() function:
	//
	// 	text = escapeCharacters(text,"\\",true);
	// 	text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
	//
	// ...but we're sidestepping its use of the (slow) RegExp constructor
	// as an optimization for Firefox.  This function gets called a LOT.

	text = text.replace(/\\(\\)/g,escapeCharacters_callback);
	text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);
	return text;
}



var _EncodeEmailAddress = function(addr) {
//
//  Input: an email address, e.g. "foo@example.com"
//
//  Output: the email address as a mailto link, with each character
//	of the address encoded as either a decimal or hex entity, in
//	the hopes of foiling most address harvesting spam bots. E.g.:
//
//	<a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
//	   x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
//	   &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
//
//  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
//  mailing list: <http://tinyurl.com/yu7ue>
//

	var encode = [
		function(ch){return "&#"+ch.charCodeAt(0)+";";},
		function(ch){return "&#x"+ch.charCodeAt(0).toString(16)+";";},
		function(ch){return ch;}
	];

	addr = "mailto:" + addr;

	addr = addr.replace(/./g, function(ch) {
		if (ch == "@") {
			// this *must* be encoded. I insist.
			ch = encode[Math.floor(Math.random()*2)](ch);
		} else if (ch !=":") {
			// leave ':' alone (to spot mailto: later)
			var r = Math.random();
			// roughly 10% raw, 45% hex, 45% dec
			ch =  (
					r > .9  ?	encode[2](ch)   :
					r > .45 ?	encode[1](ch)   :
								encode[0](ch)
				);
		}
		return ch;
	});

	addr = "<a href=\"" + addr + "\">" + addr + "</a>";
	addr = addr.replace(/">.+:/g,"\">"); // strip the mailto: from the visible part

	return addr;
}


var _UnescapeSpecialChars = function(text) {
//
// Swap back in all the special characters we've hidden.
//
	text = text.replace(/~E(\d+)E/g,
		function(wholeMatch,m1) {
			var charCodeToReplace = parseInt(m1);
			return String.fromCharCode(charCodeToReplace);
		}
	);
	return text;
}


var _Outdent = function(text) {
//
// Remove one level of line-leading tabs or spaces
//

	// attacklab: hack around Konqueror 3.5.4 bug:
	// "----------bug".replace(/^-/g,"") == "bug"

	text = text.replace(/^(\t|[ ]{1,4})/gm,"~0"); // attacklab: g_tab_width

	// attacklab: clean up hack
	text = text.replace(/~0/g,"")

	return text;
}

var _Detab = function(text) {
// attacklab: Detab's completely rewritten for speed.
// In perl we could fix it by anchoring the regexp with \G.
// In javascript we're less fortunate.

	// expand first n-1 tabs
	text = text.replace(/\t(?=\t)/g,"    "); // attacklab: g_tab_width

	// replace the nth with two sentinels
	text = text.replace(/\t/g,"~A~B");

	// use the sentinel to anchor our regex so it doesn't explode
	text = text.replace(/~B(.+?)~A/g,
		function(wholeMatch,m1,m2) {
			var leadingText = m1;
			var numSpaces = 4 - leadingText.length % 4;  // attacklab: g_tab_width

			// there *must* be a better way to do this:
			for (var i=0; i<numSpaces; i++) leadingText+=" ";

			return leadingText;
		}
	);

	// clean up sentinels
	text = text.replace(/~A/g,"    ");  // attacklab: g_tab_width
	text = text.replace(/~B/g,"");

	return text;
}


//
//  attacklab: Utility functions
//


var escapeCharacters = function(text, charsToEscape, afterBackslash) {
	// First we have to escape the escape characters so that
	// we can build a character class out of them
	var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

	if (afterBackslash) {
		regexString = "\\\\" + regexString;
	}

	var regex = new RegExp(regexString,"g");
	text = text.replace(regex,escapeCharacters_callback);

	return text;
}


var escapeCharacters_callback = function(wholeMatch,m1) {
	var charCodeToEscape = m1.charCodeAt(0);
	return "~E"+charCodeToEscape+"E";
}


} // end of Showdown.converter


// export
if (typeof module !== 'undefined') module.exports = Showdown;

// stolen from AMD branch of underscore
// AMD define happens at the end for compatibility with AMD loaders
// that don't enforce next-turn semantics on modules.
if (typeof define === 'function' && define.amd) {
	define('showdown', function() {
		return Showdown;
	});
}