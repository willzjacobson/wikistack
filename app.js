var express = require("express");
var swig = require('swig');
var routes = require('./routes');
var bodyParser = require('body-parser');
var app = express();
var wikiRouter = require('./routes/wiki');

//Rendering Stuff
app.engine('html', swig.renderFile);
app.set("view engine", "html");
app.set("views", process.cwd() + "/views");
swig.setDefaults({cache: false});

var server = app.listen(3000, function() {
    console.log("listening on port 3000");
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Logging Middleware
app.use(function(req, res, next) {
    console.log(req.method, req.url, res.statusCode);
    next();
});

app.use(express.static(__dirname + '/public')); //__dirname is the folder this file is in. 

app.use('/', routes);
app.use('/wiki', wikiRouter);