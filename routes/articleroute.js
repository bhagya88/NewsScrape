// get all dependencies
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var cheerio = require('cheerio');
var path = require('path');
var request = require('request');
var Promise = require('bluebird');

var Article = require('../models/Article');
var Note = require('../models/Note');
mongoose.Promise = Promise;

var skip = 0;

router.get("/", function(req, res) {
  console.log("root request");
  skip = 0;
  res.redirect("/articles");
});

// A GET request to scrape the echojs website
router.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.echojs.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");
      result.note=[];
      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // Tell the browser that we finished scraping the text
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  
  Article.find({})
   .populate("note")
   .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      console.log(doc);
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
router.post("/articles/:id", function(req, res) {
  console.log(req.body);
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      console.log("doc");
      console.log(doc);
      // Use the article id to find and update it's note
      //Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // Execute the above query
      Article.findOneAndUpdate({
          "_id": req.params.id
        }, {
          $push: {
            "note": doc._id
          }
        })
      .exec(function(err, doc1) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          res.json(doc);
        }
      });
    }
  });
});


// deleting notes 
router.delete('/notes/:articleId', function(req, res) {
  console.log('reqid',req.params.articleId);
 Article.findOneAndUpdate({ "_id": req.params.articleId }, { "note": [] })
    .populate("note")
    .exec(function(err, doc) {
     
      res.end();
      //res.json({success:true})
      //res.json(doc);
    });

});
 module.exports = router;