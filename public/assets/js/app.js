
// $('#next').click(function(){
// 	window.location = '/articles';
// });

// // $('#save').click(function(){
// // 	var req = $.ajax("/articles"+id);

// // 	req.done();
// // });

var articles=[];
var idx =1;
var req = $.ajax({
	url:'/articles',
	method: 'GET'

});

req.done(function(data){
	//console.log(data);
	data.forEach(function(ele,i){
		if(i===0){
		$('#title').text(ele.title);
		$('#note').text(ele.note.content);		
		}
		articles.push(ele);
	});
});

$('#next').click(function(){
	$('#title').text(articles[idx].title);
	if(articles[idx].note){
  		$('#note').text(articles[idx].note.content);
  	}else{
  		$('#note').text("");
  	}	
  	idx++;
});

$('#save').click(function(){
	var postNote = $.ajax({
		url:'/articles/'+ articles[idx-1]._id,
		method:'POST',
		data:{
			content: $('#content').val().trim()
		}
	});

	postNote.done(function(data){
		console.log("from save");
		console.log(data);
		$('#note').text(data.content);
	});

	$('#content').val('');
});
