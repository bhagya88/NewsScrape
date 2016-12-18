
$('#next').click(function(){
	window.location = '/articles';
});

$('#save').click(function(){
	var req = $.ajax("/articles"+id);

	req.done();
});


