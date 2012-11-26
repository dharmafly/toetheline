'use strict';

jQuery(function() {
    var mpTemplate = jQuery('script[type="text/tim"].mp').text();

    var policyIndex = 0;
    var mps = rebelData.mps;
    var mpKeys = _.keys(mps);
    var policies = rebelData.policies;
    var policyKeys = _.keys(policies);
//    var policyKeys = [230, 258, 358, 793, 797, 981, 1053, 1065]; //Use for demonstration purposes - just comment out


	///// Party colours
	var red = 'darkred',
		green = 'darkgreen',
		blue = 'darkblue',
		yellow = 'darkyellow',
		gray = 'gray',
		pink = 'pink',
		purple = 'purple';

	var colors = {
		'Labour': red,
		'Former Labour': red,
		'Former Independent': gray,
		'Former Conservative': blue,
		'Conservative': blue,
		'Conservative Peer': blue,
		'Former Labour Peer': red,
		'Respect': green,
		'Former Labour/Co-operative': red,
		'Labour Peer': red,
		'Former Independent Labour': red,
		'Speaker, and ': gray,
		'Former Liberal Democrat': yellow,
		'Liberal Democrat': yellow,
		'DUP Peer, Former DUP': green,
		'Independent': gray,
		'Liberal Democrat Peer': yellow,
		'Bishop': gray,
		'Former Crossbench Peer': gray,
		'Former Liberal Democrat Peer': yellow,
		'Liberal Democrat Peer, Former None': yellow,
		'Plaid Cymru': green,
		'Former UUP': yellow,
		'Former Conservative Peer': blue,
		'Scottish National Party': pink,
		'Former Plaid Cymru': green,
		'Former DUP': green,
		'Conservative Peer, Former Conservative': blue,
		'Former Bishop': gray,
		'Judge Peer': gray,
		'DUP': green,
		'Conservative Peer, Former UUP': blue,
		'UKIP Peer': purple,
		'Crossbench Peer, Former UUP': blue,
		'undefined': gray
	};


	///// LOGIC FOR REBEL POSITIONING
	function displayPolicy(p) {
		var width = jQuery('.wrapper').width(),
			rebelAreaHeight = jQuery('.above').height() / 2,
			rebelYScale = 3,
			xCenter = width / 2;
		var policy = policies[p];
		var rebels = policy.rebels;

		var row = 0;
		for(var i=0, len = rebels.length; i<len; i++) {
			if(i > 10)
				break;
			var rebel = rebels[i];

			if(rebel.rebelliousness === 0){
				break;
			}

			var mp = mps[rebel.mp];
			//console.log('positioning rebel '+rebel.mp);
			var mpElement = jQuery('div.mp.'+mp.id);

			var width = 90;
			var xOffset = 0.9 * width * row;

			var even = (i % 2) === 0;
			if(!even)
				xOffset = -xOffset;
			var x = xCenter + xOffset;

			if(i === 0 || even)
				row++;

			//console.log('row now '+row);
			//console.log(rebel.rebelliousness);

			if(i===0) {
				width *= 1.5;
			}

			//console.log(mpElement);
			mpElement.addClass('rebel newrebel')
				.css({
					left: x-(width/2)+'px',
					top: rebelAreaHeight - (rebel.rebelliousness * rebelYScale) + 'px',
					width: width+'px',
					'z-index': 100-i
				});

			var ellipsis = policy.title.length > 40 ? '...' : '';
			jQuery('.banner h2').text(policy.title.slice(0, 40)+ellipsis);

		}

		jQuery('.rebel').each(function(i, el){
			var mpElem = jQuery(el);

			// Remove identify
			if (mpElem.hasClass('newrebel')){
				mpElem.removeClass('newrebel');
			}
			// Send to bottom
			else {
				mpElem.removeClass('rebel');
			}
		});
	}


	///// UI
	jQuery('div.banner .next.button').on('click', function() {
		policyIndex++;
		if(policyIndex >= policyKeys.length)
			policyIndex = 0;

		displayPolicy(policyKeys[policyIndex]);
	});

	jQuery('div.banner .prev.button').on('click', function() {
		policyIndex--;
		if(policyIndex < 0)
			policyIndex = policyKeys.length - 1;

		displayPolicy(policyKeys[policyIndex]);
	});


	/*
	jQuery('.mp.rebel').hover(function() {
		$(this).find('.info').show();
		alert();
		console.log($(this).find('.info'));
	});
    */

	///// INIT
	/* Add MPs to DOM */
	_.each(_.keys(mps), function(k) {
	    var mp = mps[k],
	    	html = tim(mpTemplate, mp),
	    	mpElem = jQuery(html),
			color = colors[jQuery.trim(mp.party)];

		mpElem.find('.name').css('background-color', color);

	    jQuery('div.below').append(mpElem);
	})

	displayPolicy(policyKeys[0]);
});