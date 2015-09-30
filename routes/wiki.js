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
  var tags = req.body.tags.replace(",", "").split(" ");
  var page = new Page({
    title: req.body.title,
    content: req.body.content,
    tags: tags
    //urlTitle: req.body.title
  });
  // STUDENT ASSIGNMENT:
  // make sure we only redirect *after* our save is complete!
  // note: `.save` returns a promise or it can take a callback.
  page.save()
  .then(function(page) {
  	res.redirect(page.route);
	});
})

router.get("/add", function(req, res, next) {
	res.render('addpage');
})

router.get("/search", function (req, res, next){
	if (!req.query.tags) {
		res.render('lookup');
	} else {
		var tags = req.query.tags.replace(" ","").split(",");
		var desiredPages;
		Page.findByTags(tags[0])
		.then(function(pages) {
			desiredPages = pages;
			console.log("PAAAGES", pages, "DESSSSIRED", desiredPages);
			res.render('lookup');
		});
	}
})

router.get('/:requestedUrl', function(req, res, next) {
	var requestedUrl = req.params.requestedUrl;
	Page.findOne({ urlTitle: requestedUrl}).exec()
	.then(function(page) {
		res.render('wikipage', {title : page.title, content: page.content, date: page.date.toString(), tags: page.tags});
	})
	.catch(next);
})

module.exports = router;

