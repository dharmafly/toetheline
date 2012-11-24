'use strict';

jQuery(function() {
    var mpTemplate = jQuery('script[type="text/tim"].mp').text();
    var data = {name: 'Crispin Blunt', avatar: 'http://www.theyworkforyou.com/images/mps/10051.jpg'};

    var html = tim(mpTemplate, data);

    jQuery('div.rebels').append(html);
});