var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// Notice the `mongodb` protocol; Mongo is basically a kind of server,
// which handles database requests and sends responses. It's async!
var Schema = mongoose.Schema;


mongoose.connect('mongodb://localhost/wikistack'); // <= db name will be 'wikistack'
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

var statuses = ['open', 'closed'];
var pageSchema = new Schema ({
	title: {type: String, required: true},
	urlTitle: {type: String, required: true},
	content: {type: String, required: true},
	date: {type: Date, default: Date.now},
	status: {type: String, enum: statuses}, 
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

var userSchema = new Schema ({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
});

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);


pageSchema.virtual("route").get(function(){
	return "/wiki/" + this.urlTitle;
})

pageSchema.pre('validate', function(next){
  this.urlTitle = pageSchema.methods.makeUrlTitle(this.title);
  if (this.title == "") {
  	this.title = this.urlTitle;
  }
  //console.log("URL TITLE!!!: " + this.urlTitle);
  console.log("this: " + this);
	next();
});


module.exports = {
	Page: Page,
	User: User
};

pageSchema.methods.makeUrlTitle = function (pageTitle) {
	if (pageTitle) {
		pageTitle = pageTitle.replace(/[^0-9a-z]/ig, "");
		pageTitle = pageTitle.replace(" ", "_");
	} else {
		pageTitle = [];
		var arr = [0,1,2,3,4,5,6,7];
		for (var i = 0; i < 7; i++) {
			pageTitle.push(arr[Math.floor(Math.random()*8)]);
		}
		pageTitle = pageTitle.join("");
	}
	console.log(pageTitle);
	return pageTitle;
}