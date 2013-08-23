// required modules
var express = require('express');
var mongoose = require('mongoose');
var engine = require('ejs-locals');

// connect to MongoDB
var db = 'test2';
mongoose.connect('mongodb://localhost/'+db);

// initialize our app
var app = express();

app.engine('ejs', engine);

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
	password: String,
	image: String,
	bio: String,
	hidden: Boolean,
	wall: Array
})

// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {

	res.render('homepage.ejs', {message: 'Hello world!'} );

});

app.get('/login', function (req, res) {
	res.render('login.ejs');

});


// create user model using schema
var User = mongoose.model('User', userSchema);

app.post('/signup', function (req, res){
	var newUser = new User({ 
	name: req.body.username,
	password: req.body.password,
	image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
	bio: 'Welcome to NodeBook! Edit your Profile here',
	hidden: false,
	wall: []
	});
	console.log('New user: '+newUser+' has been created!');
	res.redirect('/');
});

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