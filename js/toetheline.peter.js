'use strict';

jQuery(function() {
    var mpTemplate = jQuery('script[type="text/tim"].mp').text();

/*
    var mps = {
    	diane_abbott: {id: 'diane_abbott', name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'},
    	debbie_abrahams: {id: 'debbie_abrahams', name: 'Debbie Abrahams', avatar: 'http://www.theyworkforyou.com/images/mpsL/25034.jpeg'},
    	nigel_adams: {id: 'nigel_adams', name: 'Nigel Adams', avatar: 'http://www.theyworkforyou.com/images/mpsL/24878.jpeg'},
    	diane_abbott1: {id: 'diane_abbott1', name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'},
    	debbie_abrahams1: {id: 'debbie_abrahams1', name: 'Debbie Abrahams', avatar: 'http://www.theyworkforyou.com/images/mpsL/25034.jpeg'},
    	nigel_adams1: {id: 'nigel_adams1', name: 'Nigel Adams', avatar: 'http://www.theyworkforyou.com/images/mpsL/24878.jpeg'},
    	diane_abbott2: {id: 'diane_abbott2', name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'},
    	debbie_abrahams2: {id: 'debbie_abrahams2', name: 'Debbie Abrahams', avatar: 'http://www.theyworkforyou.com/images/mpsL/25034.jpeg'},
    	nigel_adams2: {id: 'nigel_adams2', name: 'Nigel Adams', avatar: 'http://www.theyworkforyou.com/images/mpsL/24878.jpeg'},
    	diane_abbott3: {id: 'diane_abbott3', name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'},
    	debbie_abrahams3: {id: 'debbie_abrahams3', name: 'Debbie Abrahams', avatar: 'http://www.theyworkforyou.com/images/mpsL/25034.jpeg'},
    	nigel_adams3: {id: 'nigel_adams3', name: 'Nigel Adams', avatar: 'http://www.theyworkforyou.com/images/mpsL/24878.jpeg'},
    	diane_abbott4: {id: 'diane_abbott4', name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'},
    	debbie_abrahams4: {id: 'debbie_abrahams4', name: 'Debbie Abrahams', avatar: 'http://www.theyworkforyou.com/images/mpsL/25034.jpeg'},
    	nigel_adams4: {id: 'nigel_adams4', name: 'Nigel Adams', avatar: 'http://www.theyworkforyou.com/images/mpsL/24878.jpeg'}
    };

    var policies = {
    	813: {title: 'Abortion, Embryology and Euthanasia- Against', url: 'http://www.publicwhip.org.uk/policy.php?id=813', rebels: [{mp: 'diane_abbott', rebelliousness: 6}, {mp: 'nigel_adams', rebelliousness: 0}]},
    	1034: {title: 'Ban fox hunting', url: 'http://www.publicwhip.org.uk/policy.php?id=1034',
    				rebels: [{mp: 'diane_abbott', rebelliousness: 10}, {mp: 'diane_abbott1', rebelliousness: 8}, 
    						{mp: 'diane_abbott2', rebelliousness: 8}, {mp: 'nigel_adams', rebelliousness: 7},
    						{mp: 'diane_abbott3', rebelliousness: 6.8}, {mp: 'nigel_adams1', rebelliousness: 6.4},
    						{mp: 'nigel_adams2', rebelliousness: 6}, {mp: 'nigel_adams3', rebelliousness: 5},
    						{mp: 'debbie_abrahams', rebelliousness: 4.5}, {mp: 'debbie_abrahams1', rebelliousness: 4},
    						{mp: 'debbie_abrahams2', rebelliousness: 2}]}
    };
    */


//    var rebelXPositions = [1024, 600, 300, 700, 200, 800, 100, 900]; //x position (%) of rebels starting from most rebellious
//    var rebelWidths = [160, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]; //rebel image widths

    var policyIndex = 0;

    var rebelDataKeys = _.keys(rebelData);
    var mps = rebelData.mps;
    var mpKeys = _.keys(mps);
    var policies = rebelData.policies;


//    var policyKeys = _.keys(policies);

    var policyKeys = [230, 258, 358, 793, 797, 981, 1053, 1065];

//    var data = [{name: 'Crispin Blunt', avatar: 'http://www.theyworkforyou.com/images/mps/10051.jpg'},
//				{name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'}];


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

	/* Add MPs to DOM */
	_.each(_.keys(mps), function(k) {
	    var mp = mps[k],
	    	html = tim(mpTemplate, mp),
	    	mpElem = jQuery(html),
			color = colors[jQuery.trim(mp.party)];

		mpElem.find('.name').css('background-color', color);

	    jQuery('div.below').append(mpElem);
	})


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
				x -= 25;
			}

			//console.log(mpElement);
			mpElement.addClass('rebel newrebel')
				.css({
					left: x+'px',
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