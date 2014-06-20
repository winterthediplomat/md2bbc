//probably, these tests could be moved inside test_bbcode.js
test("markdown into [img] tags",function(){
	var starting_text= [
					"[img]http://lol.asd[/img]",
					"[img]http://lol.asd/test.jpg[/img]",
					"cool image by Mega-ne! [img]https://scontent-a-mxp.xx.fbcdn.net/hphotos-xfa1/t1.0-9/10487479_708870139175987_1891457286158974511_n.jpg[/img]"
					],
	expected= [
	"[img]http://lol.asd[/img]",
	"[img]http://lol.asd/test.jpg[/img]",
	"cool image by Mega-ne! [img]https://scontent-a-mxp.xx.fbcdn.net/hphotos-xfa1/t1.0-9/10487479_708870139175987_1891457286158974511_n.jpg[/img]"
			  ];
	var conv = new Showdown.converter();
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			conv.makeBBCode(starting_text[i]),
			expected[i]
			//starting_text+" => "+expected
			);
	}
});