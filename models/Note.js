var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// schema for the notes collection
var NoteSchema = new Schema({
	content:{
		type:String
	}
});

var Note = mongoose.model('Note',NoteSchema);

module.exports = Note;