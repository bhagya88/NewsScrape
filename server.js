var express = require('express');
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var bodyParser = require('bodyParser');
var path = require('path');
var methodOverride = require('method-override');
var request = require('request');
var exphbs = require('express-handlebars');
var Promise = require('bluebird');
var logger = require('logger');
var PORT = process.env.PORT || '3000';
var Article = require('./models/Article.js');
var Note = require('./models/Note.js');

mongoose.Promise = Promise;
// Database configuration with mongoose
mongoose.connect("mongodb://localhost/newscrape");
var db = mongoose.connection;

db.on()

var app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
	extended: false 
}));





app.listen(PORT);