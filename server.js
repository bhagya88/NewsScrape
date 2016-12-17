// get all dependencies
var express = require('express');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var bodyParser = require('body-parser');
var path = require('path');
var methodOverride = require('method-override');
var request = require('request');
var Promise = require('bluebird');
var logger = require('morgan');

var articleRouter = require('./routes/articleroute.js');


var PORT = process.env.PORT || '3000';


mongoose.Promise = Promise;
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newscrape");
var db = mongoose.connection;

db.on('error',function(error){
	console.log('Mongoose error',error);
})

db.once('open',function(){
 	console.log('Mongoose connection successful');
});

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false 
}));

app.use(express.static('public'));
app.use('/',articleRouter);

app.listen(PORT);