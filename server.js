// required modules
var express = require('express');

// initialize our app
var app = express();

// app configuation
app.use(express.static(__dirname+'/public'));
app.use(express.logger('dev'));

// port that server will listen on
var port = 3000;

// start listening...
app.listen(port);
console.log('Express server listening on port '+port);

// root route (response for http://localhost:3000/)
app.get('/', function (req, res) {
  res.send("Hello World");
});
