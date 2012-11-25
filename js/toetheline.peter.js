'use strict';

jQuery(function() {
    var mpTemplate = jQuery('script[type="text/tim"].mp').text();

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


//    var rebelXPositions = [1024, 600, 300, 700, 200, 800, 100, 900]; //x position (%) of rebels starting from most rebellious
//    var rebelWidths = [160, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100]; //rebel image widths

    var policyIndex = 0;

    var rebelDataKeys = _.keys(rebelData);
    mps = rebelData.mps;
    var mpKeys = _.keys(mps);
    policies = rebelData.policies;
    var policyKeys = _.keys(policies);

//    var data = [{name: 'Crispin Blunt', avatar: 'http://www.theyworkforyou.com/images/mps/10051.jpg'},
//				{name: 'Diane Abbott', avatar: 'http://www.theyworkforyou.com/images/mpsL/10001.jpeg'}];

	/* Add MPs to DOM */
	_.each(_.keys(mps), function(k) {
	    var html = tim(mpTemplate, mps[k]);
	    jQuery('div.below').append(html);
	})


	function displayPolicy(p) {
		var rebelAreaHeight = 200, rebelYScale = 3, xCenter = 590;
		var policy = policies[p];
		var rebels = policy.rebels;
		//console.log(rebels);
		var row = 0;
		for(var i=0, len = rebels.length; i<len; i++) {
			if(i >= 10)
				break;
			var rebel = rebels[i];
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

			//console.log(mpElement);
			mpElement.addClass('rebel')
				.css('left', x+'px')
				.css('top',  rebelAreaHeight - (rebel.rebelliousness * rebelYScale) + 'px')
				.css('width', width+'px')
				.css('z-index', 100-i);

			var ellipsis = policy.title.length > 40 ? '...' : '';
			jQuery('.banner h2').text(policy.title.slice(0, 40)+ellipsis);

		}
	}
	function resetRebels() {
		jQuery('.mp.rebel').removeClass('rebel');
	}

	jQuery('div.banner .next.button').on('click', function() {
		policyIndex++;
		if(policyIndex >= policyKeys.length)
			policyIndex = 0;

		resetRebels();
		displayPolicy(_.keys(policies)[policyIndex]);
	});

	jQuery('div.banner .prev.button').on('click', function() {
		policyIndex--;
		if(policyIndex < 0)
			policyIndex = policyKeys.length - 1;

		resetRebels();
		displayPolicy(_.keys(policies)[policyIndex]);
	});










	///// INIT
	displayPolicy(813);


//	resetRebels();


});