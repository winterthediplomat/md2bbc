md2bbc - Tutorial
-----------------
aka: Charlotte can't decide between BBCode and Markdown

### What is md2bbc? ###

This is md2bbc, the Charlotte-approved library.

Ok, enough fagging: md2bbc converts Markdown into BBCode text.  
It's based on (coreyti/showdown)[https://github.com/coreyti/showdown/], a javascript port of the original Markdown.pl from John Gruber (although there are [some known differences](
https://github.com/coreyti/showdown/#known-differences-in-output))
We (mainly @alfateam123 and @cenci0) adapted it to generate BBCode instead of HTML code.

### Example pls ###

Ok, so you're eager to use it, eh?

```js
var text = "Markdown *rocks*."; //the text you want to convert
var converter_options = {recognize_bbcode: true}; //some options you want to pass to the converter
var converter = new Showdown.converter(converter_options); //create the converter
var bbcode = converter.makeBBCode(text); //converting your text
alert(bbcode);
```

don't forget to include @[src/showdown.js](src/showdown.js). We provide a minified version too.

What are these *converter_options*?  
They're flags that you can use to enable some (sane) non-standard behaviours.  
If you want to know more, you can read @[the md2bbc reference](docs/reference.md).