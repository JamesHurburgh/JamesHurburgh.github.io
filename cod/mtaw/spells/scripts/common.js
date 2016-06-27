
var UNFILLED_CIRCLE = "⚪";
var FILLED_CIRCLE = "⚫";

var affiliates = [{
		"AffiliateName" : "WhiteWolf Wikia",
		"FaviconSource" : "http://www.google.com/s2/favicons?domain_url=www.wikia.com",
		"SearchPrefix" : "http://whitewolf.wikia.com/wiki/Special:Search?search=",
		"SearchSuffix" : ""
	},{
		"AffiliateName" : "DriveThruRpg",
		"FaviconSource" : "http://www.google.com/s2/favicons?domain_url=www.drivethrurpg.com",
		"SearchPrefix" : "http://drivethrurpg.com/browse.php?keywords=",
		"SearchSuffix" : ""
	},,{
		"AffiliateName" : "Amazon",
		"FaviconSource" : "http://www.google.com/s2/favicons?domain_url=www.amazon.com",
		"SearchPrefix" : "http://drivethrurpg.com/browse.php?keywords=",
		"SearchSuffix" : ""
	},
];

String.prototype.removeAll = function removeAll(stringToRemove) {
	return this.replace(new RegExp(stringToRemove, "g"), "");
};

function getAffiliateLink(affiliateName, link, title){	
	var linkText = "";
	affiliates.forEach( function (affiliate, index) {
		if(affiliateName == affiliate.AffiliateName){
			if (link) {
				linkText = "<a href='" + link + "' target='_blank' title='" + title + "on " + affiliate.AffiliateName + "'><img src='" + affiliate.FaviconSource + "''/></a>";
			} else {
				linkText = "<a href='" + affiliate.SearchPrefix + title + affiliate.SearchSuffix + "' target='_blank' title='Search for " + title + " on " + affiliate.AffiliateName + "'><img src='" + affiliate.FaviconSource + "'/>?</a>";
			}
		}
	});
	return linkText;
}

function renderRequirements(requirements) {
	if (!requirements)
		return "";
	var requirementList = "";
	arcanum = ['Fate', 'Forces', 'Death', 'Life', 'Matter', 'Mind', 'Prime', 'Space', 'Spirit', 'Time'];
	for (var i = 0; i < arcanum.length; i++) {
		required = 0;
		optional = 0;
		requirements.forEach(function (requirement, index) {
			if (requirement.Name == arcanum[i] && requirement.Optional != 'True') {
				required = requirement.Dots;
			}
			if (requirement.Name == arcanum[i] && requirement.Optional == 'True') {
				optional = requirement.Dots;
			}
		});
		var optionalExtra = Math.max(0, optional - required);
		if (required + optionalExtra > 0) {
			requirementList = requirementList + '<div>' + arcanum[i] + ' ' + Array(parseInt(required) + 1).join(FILLED_CIRCLE) + Array(parseInt(optionalExtra) + 1).join(UNFILLED_CIRCLE) + "</div>";
		}
	}

	return requirementList;
}

function arcanaCastableBySearchTerms(requirements) {
	if (!requirements)
		return "";

	var searchTerm = "";
	arcanum = ['Fate', 'Forces', 'Death', 'Life', 'Matter', 'Mind', 'Prime', 'Space', 'Spirit', 'Time'];
	for (var i = 0; i < arcanum.length; i++) {
		required = 0;
		optional = 0;
		requirements.forEach(function (requirement, index) {
			if (requirement.Name == arcanum[i] && requirement.Optional != 'True') {
				required = requirement.Dots;
			}
			if (requirement.Name == arcanum[i] && requirement.Optional == 'True') {
				optional = requirement.Dots;
			}
			var optionalExtra = Math.max(0, optional - required);

		});

		for (var dots = required; dots <= 5; dots++) {
			optional = ""; //requirement.Optional == 'True' ? 'Optional-' : '';
			searchTerm = optional + searchTerm + arcanum[i] + '-' + dots + ' ';
		}
	}

	return searchTerm;
}
function arcanaExactlySearchTerms(requirements) {
	if (!requirements)
		return "";

	var searchTerm = "";
	arcanum = ['Fate', 'Forces', 'Death', 'Life', 'Matter', 'Mind', 'Prime', 'Space', 'Spirit', 'Time'];
	for (var i = 0; i < arcanum.length; i++) {
		var dots = 0;
		requirements.forEach(function (requirement, index) {
			if (requirement.Name == arcanum[i] && requirement.Optional != 'True') {
				dots = requirement.Dots;
			}
		});
		searchTerm = searchTerm + arcanum[i] + '-' + dots + ' ';
	}
	return searchTerm;
}

function arcanaRequirementSearchTerms(requirements) {
	if (!requirements)
		return "";

	var searchTerm = "";
	requirements.forEach(function (requirement, index) {
		if (requirement.Optional != 'True') {
			searchTerm = searchTerm + requirement.Name + '-' + requirement.Dots + ' ';
		}
	});
	return searchTerm;
}

// From https://gist.github.com/helpse/4d4842c69782b9f94a72
function getQuery() {
	var data = {};

	location.search.substr(1).split('&').forEach(function (q) {
		var s = q.split('='),
		k = s[0],
		v = s[1] && decodeURIComponent(s[1]);

		if (k)
			data[k] = [v];
	});

	return data;

	// return new function () {
	// this.data = data;
	// this.toString = function () { return setQuery(this.data); };
	// this.set = function (key, val) { this.data[key] = val; return this; };
	// this.remove = function (key) { delete this.data[key]; return this; }
	// };
}

function setQuery(data) {
	var query = [];

	for (var i in data) {
		query.push(i.toString() + '=' + data[i].toString());
	}

	return '?' + query.join('&');
}

function getParameterByName(name, url) {
	if (!url)
		url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	results = regex.exec(url);
	if (!results)
		return null;
	if (!results[2])
		return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
