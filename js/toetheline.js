'use strict';

var PUBLICWHIP_BASEURL = 'http://www.publicwhip.org.uk/',
	PUBLICWHIP_POLICIES = PUBLICWHIP_BASEURL + 'policies.php',
	PUBLICWHIP_POLICY_ID_REGEXP = /\d+$/,
	PUBLICWHIP_BILL_ID_REGEXP = /number=(\d+)\b/,
	PUBLICWHIP_MP_ID_REGEXP = /mpn=(\w+)\b/;

/*
function mp(id){
	this.id = id;
	this.bills = [];
	this.policies = [{
		policy: REF,
		rebelled: 0,
		abstained: 0,
		voted: 0
	}];
	this.totals = {
		rebelled: 0,
		abstained: 0,
		voted: 0
	};
}
mp.prototype = {
};
*/

function Policy(title, path){
	this.title = title,
	this.url = this.setUrl(path);
	this.id = this.setId(path);

	if (!title || !path || this.id === null){
		throw 'Policy error: ' + this.id + ' | ' + path + ' | ' + title;
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

function Bill(title, path){
	this.title = title,
	this.url = this.setUrl(path);
	this.id = this.setId(path);

	if (!title || !path || this.id === null){
		throw 'Bill error: ' + this.id + ' | ' + path + ' | ' + title;
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

function MP(name, path){
	this.name = name,
	this.url = this.setUrl(path);
	this.id = this.setId(path);

	if (!name || !path || this.id === null){
		throw 'MP error: ' + this.id + ' | ' + path + ' | ' + name;
	}
}
MP.prototype = {
	setUrl: function(path){
		return PUBLICWHIP_BASEURL + path;
	},
	setId: function(path){
		var matches = path.match(PUBLICWHIP_MP_ID_REGEXP);
		return matches ? matches[1] : null;
	},
	setName: function(){
		return this.id.replace('')
	}
}

function dataProcessor(Constructor){
	return function(response){
		var collection = {};

		_.each(response[0].results, function(data){
			var item = new Constructor(data.text, data.href);
			collection[item.id] = item;
		});
		return collection;
	}
}

function getPolicies(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: 'table.mps tr td a',
		extract: ['href', 'text']
	});
}

function getBillsFromPolicy(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: 'table.votes tr td a',
		extract: ['href', 'text']
	});
}

function getMPsFromBill(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: '#votetable tr td:first-child a',
		extract: ['href', 'text']
	});
}

function fetchBillsFromPolicies(policies){
	var promises = [];

	_.each(policies, function(policy){
		var promise = getBillsFromPolicy(policy.url)
			.pipe(dataProcessor(Bill))
			.then(function(bills){
				policy.bills = bills;
			});
		promises.push(promise);
	});

	return jQuery.when.apply(jQuery, promises)
		.pipe(function(){
			return policies;
		});
}

function fetchMPsFromBills(policies){
	var promises = [],
		rebels = {};

	_.each(policies, function(policy){
		_.each(policy.bills, function(bill){
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

function init(){
	var policiesPromise, mpsPromise, policies, mps;

	policiesPromise = getPolicies(PUBLICWHIP_POLICIES)
		.pipe(dataProcessor(Policy))
		.pipe(fetchBillsFromPolicies)
		.pipe(function(data){
			policies = data;
			return data;
		});

	mpsPromise = policiesPromise
		.pipe(fetchMPsFromBills)
		.pipe(function(data){
			mps = data;
			return data;
		});

	jQuery.when(policiesPromise, mpsPromise)
		.then(function(){
			var data = {
				mps: mps,
				policies: policies
			};

			render(data);
		});
}

function render(data){
	console.log(data);
}

/////

// Go!
init();