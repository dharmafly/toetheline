var noodle = (function(window){
	'use strict';

	var NOODLE_BASE_URL = 'http://localhost:8888/',
		JSON = window.JSON,
		encodeURIComponent = window.encodeURIComponent,
		jQuery = window.jQuery,

		/////

		noodle = {
			baseUrl: NOODLE_BASE_URL,
			toUrl: function(query){
				return this.baseUrl +'?q=' +
					encodeURIComponent(JSON.stringify(query));
			},
			get: function(query){
				var url = this.toUrl(query);

				return jQuery.ajax(url, {
					dataType: "jsonp",
					cache: true
				});
			}
		}
    return noodle;
}(window));