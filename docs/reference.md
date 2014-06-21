md2bbc Reference
================

This is the reference of the md2bbc library.

### How can I use this library? ###

This is the basic usage of the library.

```js
var text = "Markdown *rocks*."; //the text you want to convert
var converter_options = {};     //some options you want to pass to the converter
var converter = new Showdown.converter(converter_options); //create the converter
var bbcode = converter.makeBBCode(text); //converting your text
alert(bbcode);
```

read the @[Tutorial](docs/tutorial.md) to read more about the usage of md2bbc.

### Converter Options ###

You have just to pass an hashtable with some flags: the flag list follows.

* `recognize_bbcode`
This option tells the converter to _not convert_ the code inside some BBCode tags.
Actually, the tags whose text is _not_ affected by the conversion process are
> * [code]
> * [math]/[m]
> * [url]
Specifically, in [url], \<autolink>s won't be recognized

* `multiline_quoting`
If set to true, the converter recognizes 4chan-style quoting, and only lines consecutive lines starting with `>` will be included in [quote] tags.
To trigger it, at least the first two lines must start with `>`.
The content won't be affected (only quotes into other quotes)

* `check_quotes_into_lists`
If set to true, the converter will take care of quotes used inside list' text.
The original implementation of Markdown does not check that and closes the list (`</ul>`) before closing the `<blockquote>` tag.
I suggest to set it to true.

* `enable_autolinking`
If set to true, bare links will be automatically turned into urls.
If you write something like `muh http://google.com`, you'll get `muh [url]http://google.com[/url]`, without inserting the angle brackets. They're still recognized (and recommended).