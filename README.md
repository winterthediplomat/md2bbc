md2bbc
======

a simple Markdown to BBCode parser. based [coreyti/showdown](https://github.com/coreyti/showdown/)

**Stable live** is on [niggazwithattitu.de](http://alfateam123.niggazwithattitu.de/md2bbc/), **alpha live** is available at <http://alfateam123.github.io/md2bbc>

### Usage ###

```js
var text = "Markdown *rocks*."; //the text you want to convert
var converter = new Showdown.converter(converter_options); //create the converter
var bbcode = converter.makeBBCode(text); //converting your text
alert(bbcode);
```

You can read more in the @[Tutorial](docs/tutorial.md), or read the @[Reference](docs/reference.md)

### Dependencies and browser support ###

Fortunately, md2bbc does not need any external library to work.
The tests may require to use QUnit.js, the testing library built for the jquery project.

Talking about browser support... John Frasier (the original developer of the library) [supported a lot of old browsers](https://github.com/coreyti/showdown/#browser-compatibility).  
We try to support them too, you can just try to run the [tests](http://alfateam123.github.io/md2bbc) and see it something becomes red.

### notes ###

some things (like @user and #project features) were done for [nerdz.eu](http://nerdz.eu). It's n-not I like t-this site or a-anything! @nerdzeu no baka!
Feel free to modify them in order to support twitter or your favourite social network/website.

### obligatory excited Charlotte ###

![obligatory excited Charlotte](http://x2.fjcdn.com/comments/excitement+intensifies+_79cccf3c87048a472afb5e2de9c3bba8.jpg)
