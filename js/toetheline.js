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
	}
}

function fetchPolicies(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: 'table.mps tr td a',
		extract: ['href', 'text']
	});
}

function processPolicies(response){
	var policies = {};
	_.each(response[0].results, function(data){
		var policy = new Policy(data.text, data.href);
		policies[policy.id] = policy;
	});
	return policies;
}

function fetchAllPolicyBills(policies){
	var promises = [];

	_.each(policies, function(policy){
		var promise = fetchPolicyBills(policy.url)
			.pipe(processPolicyBills)
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

function fetchPolicyBills(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: 'table.votes tr td a',
		extract: ['href', 'text']
	});
}

function processPolicyBills(response){
	var bills = {};

	_.each(response[0].results, function(data){
		var bill = new Bill(data.text, data.href);
		bills[bill.id] = bill;
	});
	return bills;
}

function fetchAllBillMPs(policies){
	var promises = [];

	_.each(policies, function(policy){
		_.each(policy.bills, function(bill){
			var promise = fetchBillMPs(bill.url)
				.pipe(processBillMPs)
				.then(function(mps){
					// TODO: pass mp by reference, as they exist on multiple bills
					bill.mps = mps;
				});
			promises.push(promise);
		});
	});

	return jQuery.when.apply(jQuery, promises)
		.pipe(function(){
			return policies;
		});
}

function fetchBillMPs(url){
	return noodle.get({
		url:  url,
		type: 'html',
		selector: '#votetable tr td:first-child a',
		extract: ['href', 'text']
	});
}

function processBillMPs(response){
	var bills = {};
	_.each(response[0].results, function(data){
		var bill = new MP(data.text, data.href);
		bills[bill.id] = bill;
	});
	return bills;
}

function init(){
	fetchPolicies(PUBLICWHIP_POLICIES)
		.pipe(processPolicies)
		.pipe(fetchAllPolicyBills)
		.pipe(fetchAllBillMPs)
		.then(render);
}

function render(data){
	console.log(data);
}

/////

// Go!
init();