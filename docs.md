md2bbc
======
aka: Charlotte can't decide between BBCode and Markdown

### What is that document? ###

This is the user documentation of md2bbc, the Charlotte-approved library.
md2bbc converts Markdown into BBCode text.

### How can I use this library? ###

This is the basic usage of the library.

```js
var text = "Markdown *rocks*."; //the text you want to convert
var converter_options = {};     //some options you want to pass to the converter
var converter = new Showdown.converter(converter_options); //create the converter
var bbcode = converter.makeBBCode(text); //converting your text
alert(bbcode);
```

Just be sure to include the library in a `<script>` tag.

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

### Charlotte, what are you doing? You're too kawaii for that! ###

We can assure that Charlotte is best girl, and she's 2cute4u too.