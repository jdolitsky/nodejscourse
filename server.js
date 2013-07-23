// required modules
var express = require('express');
var mongoose = require('mongoose');

// connect to MongoDB
var db = 'test';
mongoose.connect('mongodb://localhost/'+db);

// initialize our app
var app = express();

// app configuation
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());

// port that server will listen on
var port = 3000;

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

// create database schema for a user model
var userSchema = mongoose.Schema({
	name: String,
	image: String,
	bio: String,
	hidden: Boolean,
	wall: Array
})

// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {

	res.render('homepage.ejs', {message: 'Hello world!'} );

});

// create user model using schema
var User = mongoose.model('User', userSchema);

// user profile
app.get('/users/:userId', function (req, res) {
	var userId = req.params.userId;
	var query = {_id: userId};
	User.findOne(query, function (err, user) {
		if (err || !user) {
			res.send('No user found by id '+userId);
		} else {
			res.render('profile.ejs', {user: user});
		}
	});
});

// update bio
app.post('/updateBio/:userId', function (req, res) {
	var userId = req.params.userId;
	var query = {_id: userId};

	var newBio = req.body.bio;

	User.findOne(query, function (err, user) {
		if (err || !user) {
			res.send('No user found by id '+userId);
		} else {
			user.bio = newBio;
			user.save(function(err) {
			    if (err) {
			    	res.send('There was an error updating the users bio');
			    } else {
			    	res.redirect('/users/'+userId);
			    }
			  });
		}
	});
});