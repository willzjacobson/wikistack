var express = require('express');
var router = express.Router();
var models = require('../models/');
var Page = models.Page; 
var User = models.User; 

router.get("/", function(req, res, next) {
	res.render('wikipage');
})	

router.post('/', function(req, res, next) {
  // STUDENT ASSIGNMENT:
  // add definitions for `title` and `content`
  var page = new Page({
    title: req.body.title,
    content: req.body.content,
    //urlTitle: req.body.title
  });
  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save()
  .then(function(page) {
  	res.json(page, null, 2);
	});
})

router.get("/add", function(req, res, next) {
	res.render('addpage');
})

router.get('/:requestedUrl', function(req, res, next) {
	var requestedUrl = req.params.requestedUrl;
	Page.findOne({ urlTitle: requestedUrl}).exec()
	.then(function(page) {
		console.log("page", page);
		res.render('wikipage', {title : page.title});
	})
	.catch(next);
})

module.exports = router;

