/*global jQuery, tim, _*/
(function(){
    'use strict';

    function init(mps, policies) {
        var mpTemplate = jQuery('script[type="text/tim"].mp').text(),
            policyIndex = 0,
            // mpKeys = _.keys(mps),
            policyKeys = _.keys(policies),
            // policyKeys = [230, 258, 358, 793, 797, 981, 1053, 1065], //Use for demonstration purposes - just comment out


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


        ///// LOGIC FOR REBEL POSITIONING
        function displayPolicy(p) {
            var width = 130, //jQuery('.wrapper').width(),
                rebelAreaHeight = jQuery('.above').height() / 2,
                rebelYScale = 2.6,
                xCenter = width / 2,
                policy = policies[p],
                rebels = policy.rebels,
                x = 0,
                xOffset = 0,
                scaleFactor = 0.8, //The scale factor from each rebel to the next
                spaceFactor = 0.85, //The spacing between rebels
                rebel, mp, mpElement, even, i, len, ellipsis;

            for(i=0, len = rebels.length; i<len; i++) {
                if (i > 12){
                    break;
                }

                rebel = rebels[i];
                mp = mps[rebel.mp];
                //console.log('positioning rebel '+rebel.mp);
                mpElement = jQuery('div.mp.'+mp.id);

                even = (i % 2) === 0;

                if (i !== 0 && !even) {
                    xOffset += spaceFactor * width;
                }
                if (!even) {
                    width *= scaleFactor;
                }
                if (even) {
                    x = xCenter + xOffset;
                }
                else {
                    x = xCenter - xOffset;
                }

                //console.log('doing '+i+' even '+even+' width '+width+' xOffset '+xOffset);
                mpElement.addClass('rebel newrebel')
                    .css({
                        left: x-(width/2)+'px',
                        top: rebelAreaHeight - (rebel.rebelliousness * rebelYScale) + 'px',
                        width: width+'px',
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
        });

        displayPolicy(policyKeys[0]);
    }


    // Get data
    jQuery.when(
            jQuery.getJSON('data/mps'),
            jQuery.getJSON('data/policies')
        )
        .then(function(mpsResponse, policiesResonse){
            init(mpsResponse[0], policiesResonse[0]);
        });
}());