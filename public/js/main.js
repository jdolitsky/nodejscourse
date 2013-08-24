jQuery(document).ready(function() {
	jQuery("abbr.timeago").timeago();
	$("#newstatus").keydown(function(e){
	    if (e.keyCode == 13) {
	        $('#postNewStatus').submit();
	    }
	}); 
});

var hostname = window.location.hostname;
var socket = io.connect(hostname);

socket.on('newStatus', function (res) { 
	console.log(res.statusData);
	var time = new Date(res.statusData.time).toISOString();
	var addStatus = '<div class="post"><div class="timestamp"><abbr class="timeago" title="'+time+
				'"></abbr></div><a class="colorize" href="/users/'+res.statusData.username+
				'"><div class="smallpic"><img class="smallpic_img" src="'+res.statusData.image+
				'"/></div>	<div class="smallname">'+res.statusData.username+
				'</div></a><br><div class="statusbody">'+res.statusData.body+'</div></div>';
    $('#socket').prepend(addStatus);

    var pageuser = $('#theusername').text();
    if (pageuser == res.statusData.username && pageuser != myname) {
    	$('#postsOuter').prepend(addStatus);
    }

    jQuery("abbr.timeago").timeago();
});
