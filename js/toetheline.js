'use strict';

var request = noodle.get({
	url:  'http://www.publicwhip.org.uk/feeds/mp-info.xml',
	type: 'xml'
});

request.then(function(data){
	console.log(data);
});