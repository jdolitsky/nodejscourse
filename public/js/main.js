jQuery(document).ready(function() {
	jQuery("abbr.timeago").timeago();
});

var socket = io.connect('http://localhost:3000');
socket.on('newStatus', function (status) { 
    console.log(status.username);
});