// required modules
var express = require('express');
var mongoose = require('mongoose');
var engine = require('ejs-locals');

// connect to MongoDB
var db = 'coloft';
mongoose.connect('mongodb://localhost/'+db);

// initialize our app
var app = express();

// app configuation
app.engine('ejs', engine);
app.set('views', __dirname+'/views');
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({secret: 'coloft'}));

// port that server will listen on
var port = 3000;

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);


// create user model 
var User = mongoose.model('User', {
	username: String,
	password: String,
	image: String,
	bio: String,
});

// create status model
var Status = mongoose.model('Status', {
	body: String,
	time: Number,
	username: String,
	image: String,
	comments: Array,
	likes: Array
});

app.get('/', function (req, res) {

	if (req.session.user){

		Status.find({},function (err, statuses){
			res.render('homepage.ejs', {user: req.session.user, statuses: statuses});
		});

	} else {

		res.render('welcome.ejs');
	}

});

app.get('/logout', function (req, res) {

	delete req.session.user;
	res.redirect('/login');

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
	var username = req.body.username.toLowerCase();
	var password = req.body.password;

	var query = {username: username, password: password};

	User.findOne(query, function (err, user) {
		console.log(err);
		console.log(user);
		if (err || !user) {
			res.redirect('/login?error2=1');
		} else {
			req.session.user = user;
			res.redirect('/');
		}
	});
});


app.post('/signup', function (req, res){

	var username = req.body.username.toLowerCase();
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

				var userData = { 
					username: username,
					password: password,
					image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
					bio: 'Im new to NodeBook!',
					hidden: false,
					wall: []
				};

				var newUser = new User(userData).save(function (err){

					req.session.user = userData;
					console.log('New user: '+newUser+' has been created!');
					res.redirect('/users/'+username);
					
				});
			}
		});
	}
});

// user profile
app.get('/users/:username', function (req, res) {

	var username = req.params.username.toLowerCase();
	var query = {username: username};
	var currentUser = req.session.user;

	User.findOne(query, function (err, user) {

		if (err || !user) {
			res.send('No user found by id '+username);
		} else {
			Status.find(query, function(err, statuses){
				res.render('profile.ejs', {
					user: user, 
					statuses: statuses, 
					currentUser: currentUser
				});	
			});
		}

	});
});

app.post('/bio', function (req, res) {
	
	var username = req.session.user.username;
	var query = {username: username};

	var newBio = req.body.bio;

	User.findOne(query, function (err, user) {

		if (err || !user) {

			res.send('No user found by name '+username);

		} else {

			user.bio = newBio;
			user.save(function(err) {
			    if (err) {
			    	res.send('There was an error updating the users bio');
			    } else {
			    	res.redirect('/users/'+username);
			    }
			});

		}
	});
});

app.post('/statuses', function (req, res) {

	var status = req.body.status;
	var username = req.session.user.username;
	var pic = req.session.user.image;

	var newStatus = new Status({ 
		body: status,
		time: new Date().getTime(),
		username: username,
		image: pic,
		comments: [],
		likes: []
	}).save(function (err){

		res.redirect('/users/'+username);

	});

});