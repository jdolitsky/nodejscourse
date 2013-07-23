// required modules
var mongoose = require('mongoose');

// connect to MongoDB
var db = 'test';
mongoose.connect('mongodb://localhost/'+db);

// create database schema for a user model
var userSchema = mongoose.Schema({
	name: String,
	image: String,
	bio: String,
	hidden: Boolean,
	wall: Array
})

// create user model using schema
var User = mongoose.model('User', userSchema);

var josh = new User({ 
	name: 'Josh Dolitsky',
	image: 'http://m.c.lnkd.licdn.com/media/p/3/000/10e/1a3/03c6dca.jpg',
	bio: 'I am a web developer from Chicago',
	hidden: false,
	wall: []
});

josh.save(function (err, user) {
	var message;
	if (err) {
		message = 'There was an error. Please try again.';
	} else {
		message = 'User with _id '+user._id+' was successfully created.';
	}
	console.log(message);
	process.exit();
});