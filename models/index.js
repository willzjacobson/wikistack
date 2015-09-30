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
	author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	tags: [String]
});

var userSchema = new Schema ({
	name: {type: String, required: true},
	email: {type: String, required: true, unique: true}
});

pageSchema.virtual("route").get(function(){
	return "/wiki/" + this.urlTitle;
})

pageSchema.pre('validate', function(moveOn){
  this.urlTitle = pageSchema.methods.makeUrlTitle(this.title);
  if (this.title == "") {
  	this.title = this.urlTitle;
  }
	moveOn();
});

pageSchema.statics.findByTags = function(tags) {
	return this.find({tags: {$elemMatch: { $eq: tags } } })
	.exec();
};

var Page = mongoose.model('Page', pageSchema);
var User = mongoose.model('User', userSchema);

module.exports = {
	Page: Page,
	User: User
};

pageSchema.methods.makeUrlTitle = function (pageTitle) {
	if (pageTitle) {
		urlTitle = pageTitle.replace(/[^0-9a-z]/ig, "");
		urlTitle = urlTitle.replace(" ", "_");
	} else {
		urlTitle = [];
		var arr = [0,1,2,3,4,5,6,7];
		for (var i = 0; i < 7; i++) {
			urlTitle.push(arr[Math.floor(Math.random()*8)]);
		}
		urlTitle = urlTitle.join("");
	}
	return urlTitle;
}






