/*global jQuery, tim, _*/
(function(){
    'use strict';

    var mps,
        policies,
        policyKeys,
        policyIndex = 0 //the index of the displayed policy;

    function init() {
        var mpTemplate = jQuery('script[type="text/tim"].mp').text(),
        ///// Party colours
            red = 'darkred',
            green = 'darkgreen',
            blue = 'darkblue',
            yellow = 'darkyellow',
            gray = 'gray',
            pink = 'pink',
            purple = 'purple',

            colors = {
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

        policyKeys = _.keys(policies);
        // policyKeys = [230, 258, 358, 793, 797, 981, 1053, 1065]; //Use for demonstration purposes - just comment out

        ///// UI
        jQuery('div.banner .next.button').on('click', function() {
            policyIndex++;
            if (policyIndex >= policyKeys.length){
                policyIndex = 0;
            }

            displayPolicy(policyKeys[policyIndex]);
        });

        jQuery('div.banner .prev.button').on('click', function() {
            policyIndex--;
            if (policyIndex < 0){
                policyIndex = policyKeys.length - 1;
            }

            displayPolicy(policyKeys[policyIndex]);
        });

        ///// INIT
        /* Add all MPs to DOM */
        _.each(_.keys(mps), function(k) {
            var mp = mps[k],
                html = tim(mpTemplate, mp),
                mpElem = jQuery(html),
                color = colors[jQuery.trim(mp.party)];

            mpElem.find('.name').css('background-color', color);
            jQuery('div.below').append(mpElem);
        });

        displayPolicy(policyKeys[0]);
    }


    ///// LOGIC FOR REBEL POSITIONING
    function displayPolicy(p) {
        var viewportWidth = jQuery('.wrapper').width(),
            rebelAreaHeight = 210,
            bannerHeight = 120,
            xCenter = viewportWidth / 2, // x position of the first (i.e. biggest) rebel
            firstImageWidth = 120, // image width of the first rebel
            minImageWidth = 60,
            xOffset = 60, // x horizontal offset from one rebel to the next
            xPos = 0, // x position of rebel
            numRebelsToDisplay = 13,
            policy = policies[p],
            rebels = policy.rebels,
            rebel, mp, mpElement, i, ellipsis, top, displayImageWidth, rHigh, rLow,
            normR /* normalised rebelliousness [0,1] */,
            policyTemplate = jQuery('script[type="text/tim"].policy').text();

        // Adjust numRebelsToDisplay if there aren't enough rebels in this policy
        numRebelsToDisplay = numRebelsToDisplay > rebels.length ? rebels.length : numRebelsToDisplay;

        // Calculate scale factor for distributing the rebels over the full height of the area above the line
        rHigh = rebels[0].r;
        rLow = rebels[numRebelsToDisplay-1].r;
        var rebelYScale = rHigh === rLow ? 1 : rebelAreaHeight / (rHigh - rLow);

        for(i = 0; i < numRebelsToDisplay; i++) {
            rebel = rebels[i];
            mp = mps[rebel.mp];

            // Normalise the rebelliousness
            normR = rHigh === rLow ? 0.5 : ( rebel.r - rLow ) / (rHigh - rLow);

            //console.log('positioning rebel '+rebel.mp);
            mpElement = jQuery('div.mp.'+mp.id);

            if( i === 0 ) {
                xPos = xCenter;
            } else if ( i%2 === 1) {
                xPos = xCenter + ( Math.floor( ( i + 1 ) / 2 ) * xOffset );
            } else {
                xPos = xCenter - ( Math.floor( ( i + 1 ) / 2 ) * xOffset );                
            }

            // Calculate location and size
            top = - ( rebelAreaHeight + (( rebel.r - rLow ) * rebelYScale) + 15 );
            displayImageWidth = firstImageWidth * normR < minImageWidth ? minImageWidth : firstImageWidth * normR;

            mpElement.addClass('rebel newrebel')
                .css({
                    left: xPos-(displayImageWidth /2)+'px',
                    top: top + 'px',
                    width: displayImageWidth +'px',
                    height: displayImageWidth * 1.6 + 'px',
                    'z-index': 100-i,
                    'font-size' : 10 + normR * 2 + 'px'
                });

            ellipsis = policy.title.length > 40 ? '...' : '';
            jQuery('.banner h2').html(tim(policyTemplate, {
                name: policy.title.slice(0, 40)+ellipsis,
                url: policy.url
            }));
        }

        jQuery('.rebel').each(function(i, el){
            var mpElement = jQuery(el);

            // Remove identify
            if (mpElement.hasClass('newrebel')){
                mpElement.removeClass('newrebel');
            }
            // Send to bottom
            else {
                mpElement.removeClass('rebel');
            }
        });
    }

    // Get data
    jQuery.when(
            jQuery.getJSON('data/mps'),
            jQuery.getJSON('data/policies')
        )
        .then(function(mpsResponse, policiesResponse){
            mps = mpsResponse[0];
            policies = policiesResponse[0];
            // console.log(mps, policies);
            init();
        });
}());