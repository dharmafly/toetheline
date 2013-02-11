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
            rebelAreaHeight = jQuery('.above').height() / 2,
            xCenter = viewportWidth / 2, // x position of the first (i.e. biggest) rebel
            imageWidth = 130, // image width of the first rebel
            rebelYScale = 2.6, // rebelliousness scale factor  in y
            xOffset = 0, // x horizontal offset from one rebel to the next
            scaleFactor = 0.8, // the image size scale factor from each rebel to the next
            spaceFactor = 0.85, // the spacing between rebels
            xPos = 0, // x position of rebel
            policy = policies[p],
            rebels = policy.rebels,
            rebel, mp, mpElement, even, i, len, ellipsis;

        for(i=0, len = rebels.length; i < len; i++) {
            // Just display top 13 rebels
            if (i > 12) {
                break;
            }

            rebel = rebels[i];
            mp = mps[rebel.mp];

            //console.log('positioning rebel '+rebel.mp);
            mpElement = jQuery('div.mp.'+mp.id);

            even = (i % 2) === 0;

            if (i !== 0 && !even) {
                xOffset += spaceFactor * imageWidth;
            }
            if (!even) {
                imageWidth *= scaleFactor;
            }
            if (even) {
                xPos = xCenter + xOffset;
            }
            else {
                xPos = xCenter - xOffset;
            }

            mpElement.addClass('rebel newrebel')
                .css({
                    left: xPos-(imageWidth/2)+'px',
                    top: rebelAreaHeight - (rebel.r * rebelYScale) + 'px',
                    width: imageWidth+'px',
                    'z-index': 100-i
                });

            ellipsis = policy.title.length > 40 ? '...' : '';
            jQuery('.banner h2').text(policy.title.slice(0, 40)+ellipsis);
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
            init();
        });
}());