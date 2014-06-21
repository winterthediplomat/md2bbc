//probably, these tests could be moved inside test_bbcode.js
test("markdown into [img] tags",function(){
	var starting_text= [
					"[img]http://lol.asd[/img]",
					"[img]http://lol.asd/test.jpg[/img]",
					"cool image by Mega-ne! [img]https://scontent-a-mxp.xx.fbcdn.net/hphotos-xfa1/t1.0-9/10487479_708870139175987_1891457286158974511_n.jpg[/img]",
					"[img]http://blog-imgs-64.fc2.com/y/a/r/yaraon/tumblr_n3xhefu1W71qzvtljo1_1280.jpg[/img]"
					],
	expected= [
	"[img]http://lol.asd[/img]",
	"[img]http://lol.asd/test.jpg[/img]",
	"cool image by Mega-ne! [img]https://scontent-a-mxp.xx.fbcdn.net/hphotos-xfa1/t1.0-9/10487479_708870139175987_1891457286158974511_n.jpg[/img]",
	"[img]http://blog-imgs-64.fc2.com/y/a/r/yaraon/tumblr_n3xhefu1W71qzvtljo1_1280.jpg[/img]"
	];
	var conv = new Showdown.converter({recognize_bbcode:true});
	for(var i = 0; i<starting_text.length; i++){
		deepEqual(
			conv.makeBBCode(starting_text[i]),
			expected[i]
			//starting_text+" => "+expected
			);
	}
});