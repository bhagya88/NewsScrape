
var articles=[];
var idx =1;


// get all articles
var getArticles = $.ajax({
	url:'/articles',
	method: 'GET'

});

// store data in articles array.Show the first article on the page
getArticles.done(function(data){
		data.forEach(function(ele,i){

		// first article
		if(i===0){

			$('#title').text(ele.title);
			$('#articleNum').text('1');

			// if the article has any notes, show them on page
			if(ele.note && ele.note.length){
				ele.note.forEach(function(ele){
					$('#note').append('<p>'+ele.content+'</p>');
				});
				
			 }		
		}

		// push all the date into articles array for later use.
		articles.push(ele);
	});
});

// fetches next article when user clicks on on next
$('#next').click(function(){
	// check if we reached end of articles
	if(idx<articles.length){
		// show article on page
		$('#title').text(articles[idx].title);
		$('#articleNum').text(idx+1);
		
		// if there are any notes for the article, show them on page
		if(articles[idx].note.length){
			articles[idx].note.forEach(function(ele){
					$('#note').append('<p>'+ele.content+'</p>');
				});
	  		
	  	}else{
	  		$('#note').text("");
	  	}	
	  	idx++;
  }
});


// save the new notes
$('#save').click(function(){
	var noteContent = $('#content').val().trim();

	// if the note is not empty
	if(noteContent){

	// post the note
	var postNote = $.ajax({
		url:'/articles/'+ articles[idx-1]._id,
		method:'POST',
		data:{
			content: noteContent
		}
	});

	postNote.done(function(data){
		//show the note on the saved notes page
		$('#note').append('<p>'+data.content+'</p>');
	});

	// remove the note from new note page
	$('#content').val('');

	}
	
});

// delete all notes associated with an article
$('#delete').click(function(){

	// make a delete request
	var deleteNote = $.ajax({
		url:'/notes/'+ articles[idx-1]._id+'?_method=DELETE',
		method:'POST',
		data:{}
	});

	deleteNote.done(function(data){
		$('#note').text("");
	});

});
