'use strict';

jQuery(function() {
    var mpTemplate = jQuery('script[type="text/tim"].mp').text();


    var data = [{name: 'Crispin Blunt', avatar: 'http://www.theyworkforyou.com/images/mps/10051.jpg'},
				{name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'}];

	for(var i=0, len=data.length; i<len; i++) {
		var d = data[i];
		d.position = i;
	    var html = tim(mpTemplate, d);
	    jQuery('div.rebels').append(html);
	}


});