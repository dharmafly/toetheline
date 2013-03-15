'use strict';

/*
    Data is scraped as follows:

    All rebel MPs: http://www.publicwhip.org.uk/mps.php?sort=rebellions
    All policies:  http://www.publicwhip.org.uk/policies.php
	Bills in each policy e.g: http://www.publicwhip.org.uk/policy.php?id=1065
	Rebel MPs from each bill: http://www.publicwhip.org.uk/division.php?date=2011-05-24&number=286&dmp=1065

*/

var PUBLICWHIP_BASEURL = 'http://www.publicwhip.org.uk/',
    PUBLICWHIP_POLICIES = PUBLICWHIP_BASEURL + 'policies.php',
    PUBLICWHIP_REBELS = PUBLICWHIP_BASEURL + 'mps.php?sort=rebellions',
    PUBLICWHIP_POLICY_ID_REGEXP = /\d+$/,
    PUBLICWHIP_BILL_ID_REGEXP = /number=(\d+)\b/,
    PUBLICWHIP_MP_ID_REGEXP = /mpn=(\w+)\b/,
    THEYWORKFORYOU_BASEURL = 'http://www.theyworkforyou.com';

function Policy(settings){
    jQuery.extend(this, settings);
    this.title = jQuery.trim(this.title);
    this.url = this.setUrl(settings.path);
    this.id = this.setId(settings.path);

    if (!this.title || !this.path || this.id === null){
        throw 'Policy error: ' + this.id + ' | ' + this.path + ' | ' + this.title;
    }
}
Policy.prototype = {
    setUrl: function(path){
        return PUBLICWHIP_BASEURL + path;
    },
    setId: function(path){
        var matches = path.match(PUBLICWHIP_POLICY_ID_REGEXP);
        return matches ? matches[0] : null;
    }
}

function Bill(settings){
    jQuery.extend(this, settings);
    this.title = jQuery.trim(settings.title);
    this.url = this.setUrl(settings.path);
    this.id = this.setId(settings.path);

    if (!this.title || !this.path || this.id === null){
        throw 'Bill error: ' + this.id + ' | ' + this.path + ' | ' + this.title;
    }
}
Bill.prototype = {
    setUrl: function(path){
        return PUBLICWHIP_BASEURL + path;
    },
    setId: function(path){
        var matches = path.match(PUBLICWHIP_BILL_ID_REGEXP);
        return matches ? matches[1] : null;
    }
}

function MP(settings){
    jQuery.extend(this, settings);
    this.title = jQuery.trim(settings.title);
    this.url = this.setUrl(settings.path);
    this.id = this.setId(settings.path);

    if (!this.title || !this.path || this.id === null){
        throw 'MP error: ' + this.id + ' | ' + this.path + ' | ' + this.title;
    }
}
MP.prototype = {
    setUrl: function(path){
        return PUBLICWHIP_BASEURL + path;
    },
    setId: function(path){
        var matches = path.match(PUBLICWHIP_MP_ID_REGEXP);
        return matches ? matches[1] : null;
    }
}

function dataProcessor(Constructor){
    return function(response){
        var collection = {};

        _.each(response[0].results, function(data){
            var item = new Constructor({
                title: data.text,
                path: data.href
            });
            collection[item.id] = item;
        });

        return collection;
    }
}

// Current members
function getRebels(url){
    return noodle.get({
        url:  PUBLICWHIP_REBELS,
        type: 'html',
        selector: 'table.mps tr:not(.headings)',
        extract: ['html']
    });
}

function getPolicies(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: 'table.mps tr td a',
        extract: ['href', 'text']
    });
}

/*
function getBillsFromPolicy(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: 'table.votes tr td a',
        extract: ['href', 'text']
    });
}
*/


function getMPsFromBill(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: '#votetable tr td:first-child a',
        extract: ['href', 'text']
    });
}

/*
function getStatsFromBill(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: '.tableexplain + table tr:not(.headings)',
        extract: ['html']
    });
}
*/

function getMPTheyWorkForYouUrl(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: '#main li a[href^="http://www.theyworkforyou.com/"]',
        extract: ['href']
    });
}

function getMPTheyWorkForYouMP(url){
    return noodle.get({
        url:  url,
        type: 'html',
        selector: '.main',
        extract: ['html']
    });
}

function processRebels(response){
    var rebels = {};

    _.each(response[0].results, function(data){
        var cells = jQuery(data.html),
            mp = new MP({
                title: cells.eq(0).text(),
                path: cells.eq(0).find('a').attr('href'),
                consituency: cells.eq(1).text(),
                consituencyUrl: cells.eq(1).attr('href'),
                party: cells.eq(2).text(),
                r: parseInt(cells.eq(3).text())
            });
            rebels[mp.id] = mp;
    });
    return rebels;
}

function fetchBillsFromPolicies(policies){
    var queries = [];

    _.each(policies, function(policy){
        queries.push({
            url:  policy.url,
            type: 'html',
            selector: 'table.votes tr td a',
            extract: ['href', 'text']
        });
    });

    return noodle.get(queries)
        .pipe(function(policyBills){
        	var processBills = dataProcessor(Bill),
        		i = 0,
        		policyId;

        	for (policyId in policies){
        		if (policies.hasOwnProperty(policyId)){
        			policies[policyId].bills = processBills([policyBills[i]]);
        			i++;
        		}
        	}
        	return policies;
        });
}

/*
function fetchStatsFromBills(policies){
    var promises = [];

    _.each(policies, function(policy){
        _.each(policy.bills, function(bill){
        	// MP data
            var promise = getStatsFromBill(bill.url)
                .pipe(function(response){
                    var data = response[0].results;
					_.each(data.slice(1), function(partyData){
					    var cells = jQuery(partyData.html),
					        party = cells[0].textContent,
					        
					});
                });
            promises.push(promise);
        });
    });

    return jQuery.when.apply(jQuery, promises)
        .pipe(function(){
            return policies;
        });
}
*/

function fetchMPsFromBills(policies){
    var promises = [],
        rebels = {};

    _.each(policies, function(policy){
        _.each(policy.bills, function(bill){
        	// MP data
            var promise = getMPsFromBill(bill.url)
                .pipe(dataProcessor(MP))
                .then(function(rebelsForBill){
                    // Pass MP by reference, as they exist on multiple bills
                    bill.rebels = [];

                    _.each(rebelsForBill, function(mp){
                        if (!rebels[mp.id]){
                            rebels[mp.id] = mp;
                        }
                        bill.rebels.push(mp.id);
                    });
                });
            promises.push(promise);
        });
    });

    return jQuery.when.apply(jQuery, promises)
        .pipe(function(){
            return rebels;
        });
}

function fetchMPsExtended(mps){
    var promises = [];

    _.each(mps, function(mp){
        var mpDeferred = jQuery.Deferred();
        promises.push(mpDeferred.promise());

        getMPTheyWorkForYouUrl(mp.url)
            .pipe(function(response){
                mp.theyworkforyouUrl = response[0].results[0].href;

                getMPTheyWorkForYouMP(mp.theyworkforyouUrl)
                    .pipe(function(response){
                        var data = response[0].results[0],
                            dom = jQuery(data.html),
                            avatar = dom.filter('.person').find('img').attr('src'),
                            //h1 = dom.find('h1'),
                            //title = h1[0].childNodes[0],
                            position = dom.filter('h1').find('span')[0],
                            party = position.childNodes[0].textContent,
                            consituency = position.childNodes[2] ? position.childNodes[2].textContent.replace(' for ', '') : position.childNodes[0].textContent,
                            votingRecord = dom.filter('#dreamcomparisons').find('li')
                            	.map(function(i, el){
                            		return jQuery.trim(el.textContent
                            				.replace(/[\r\n]/g, '')
                            				.replace(/  votes/, '')
                            		);
                            	}).get();

                        jQuery.extend(mp, {
                            avatar: THEYWORKFORYOU_BASEURL + avatar,
                            party: party,
                            consituency: consituency,
                            votingRecord: votingRecord
                        });

                        mpDeferred.resolve(mp);
                    });
            });
    });

    return jQuery.when.apply(jQuery, promises)
        .pipe(function(){
            return mps;
        });
}

function init(){
    var rebelsPromise, policiesPromise, mpsPromise;

    rebelsPromise = getRebels(PUBLICWHIP_REBELS)
        .pipe(processRebels);

    policiesPromise = getPolicies(PUBLICWHIP_POLICIES)
        .pipe(dataProcessor(Policy))
        //.pipe(fetchStatsFromBills)
        .pipe(fetchBillsFromPolicies);

    mpsPromise = policiesPromise
        .pipe(fetchMPsFromBills)
        .pipe(fetchMPsExtended);

    jQuery.when(rebelsPromise, policiesPromise, mpsPromise)
        .then(function(rebels, policies, mps){
            var data;

            // Add overall rebelliousness
            _.each(rebels, function(rebel){
                // TODO: why are some rebels not in mps collection?
                if (mps[rebel.id]){
                    mps[rebel.id].r = rebel.r;
                }
            });
            
            _.each(policies, function(policy){
                policy.rebels = {};

                _.each(policy.bills, function(bill){
                    _.each(bill.rebels, function(mpId){
                        var mp = mps[mpId];
                        if (!policy.rebels[mpId]){
                            policy.rebels[mpId] = 1;
                        }
                        else {
                            policy.rebels[mpId] ++;
                        }
                    });
                });

                policy.rebels = _.map(policy.rebels, function(rebelliousness, mpId){
                    return {
                        mp: mpId,
                        r: rebelliousness
                    };
                });

                policy.rebels = _.sortBy(policy.rebels, function(mp){
                    return 100 - mp.r;
                });
            });


            data = {
                mps: mps,
                policies: policies
            };

            render(data);
        });
}

function render(data){
    window.data = data;
    console.log(data);
    console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n*****************');

    /*
    jQuery('body').empty().append(
	    jQuery('<textarea/>').val(JSON.stringify(data.mps))
	);
	*/
}

/////

// Go!
if (window.location.search === '?live'){
    init();
}