// required modules
var express = require('express');
var mongoose = require('mongoose');
var engine = require('ejs-locals');

// connect to MongoDB
var db = 'test3';
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
	username: String,
	password: String,
	image: String,
	bio: String,
	hidden: Boolean,
	wall: Array
});

// create user model using schema
var User = mongoose.model('User', userSchema);
// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {

	res.render('homepage.ejs', {message: 'Hello world!'} );

});

app.get('/login', function (req, res) {
	var error1 = null;
	var error2 = null;

	if (req.query.error1) {
		error1 = "Sorry please try again";
	}

	if (req.query.error2) {
		error2 = "Sorry please try again";
	}

	res.render('login.ejs', {error1: error1, error2: error2});
});

app.post('/login', function (req, res) {
	var username = req.body.username;
	var password = req.body.password;

	var query = {username: username, password: password};

	User.findOne(query, function (err, user) {
		console.log(err);
		console.log(user);
		if (err || !user) {
			res.redirect('/login?error2=1');
		} else {
			res.redirect('/');
		}
	});
});


app.post('/signup', function (req, res){
	var username = req.body.username;
	var password = req.body.password;
	var confirm = req.body.confirm;
	if(password != confirm){
		res.redirect('/login?error1=1');
	}
	else{
		var query = {username: username};
		console.log(query);

		User.findOne(query, function (err, user) {
			if (user) {
				res.redirect('/login?error1=1');
			} else {
					var newUser = new User({ 
					username: username,
					password: password,
					image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
					bio: 'Welcome to NodeBook! Edit your Profile here',
					hidden: false,
					wall: []
					}).save(function (err){
						console.log('New user: '+newUser+' has been created!');
						res.redirect('/');
					});
			}
		});
	}
});

// user profile
app.get('/users/:username', function (req, res) {
	var username = req.params.username;
	var query = {username: username};
	User.findOne(query, function (err, user) {
		if (err || !user) {
			res.send('No user found by id '+username);
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