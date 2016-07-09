
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
		"SearchPrefix" : "https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Dstripbooks&field-keywords=",
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

function makeSpellLink(spellName){
	return makePageLink(spellName, "spell");
}

function makeBookLink(bookName){
	return makePageLink(bookName, "book");
}

function makeLegacyLink(legacyName){
	return makePageLink(legacyName, "legacy");
}

function makePageLink(name, type){
	//return legacy;
	return "<a target='_blank' href='" + type + ".html\?" + type + "=" + escape(name) + "'>" + name + "</a>";
}

function emphasiseText(text, callback){
		
		$.when()	
		.then(	
			function() 	{ getData("infoBoxes", function(data){
				// Insert infoBoxes
				data.forEach(function(inset) {
					if(inset.Type == "html"){
						var replacementText = '<div class="well">' + inset.html + '</div>';
						text = text.replace(inset.PlacementText, replacementText);
					}
				});
			}); 
		})
		.then(	
			function() 	{ getData("spells", function(data){
				// Insert infoBoxes
				data.forEach(function(spell) {
					text = text.replace(new RegExp('\\b'+spell.Name+'\\b'), makePageLink(spell.Name, "spell"));
				});
			}); 
		})
		.done();

		callback(text);
}
function doNOhitng(){
		
		// Turn spell names into links
		$(spells).each(function (index, spell) {
			text = text.replace(new RegExp('\\b'+spell.Name+'\\b'), "<a href='spell.html\?spell=" + escape(spell.Name) + "'>" + spell.Name + "</a>");
		});
		
		// Emphasise Arcana names
		$(arcanum).each(function (index, arcana) {
			text = text.replace(new RegExp(arcana.Name, "g"), "<strong>" + arcana.Name + "</strong>");
		});
		
		// Emphasise Attribute names
		$(attributes).each(function (index, attribute) {
			text = text.replace(new RegExp(attribute.Name, "g"), "<strong>" + attribute.Name + "</strong>");
		});
		
		// Emphasise Skill names
		$(skills).each(function (index, skill) {
			text = text.replace(new RegExp(skill.Name, "g"), "<strong>" + skill.Name + "</strong>");
		});
		
		// Popover text for glossary
		$(glossary).each(function (index, term) {
			regex = new RegExp('(\\b' + term.Term + '\\b)(?![^<]*>|[^<>]*</)');
			replacement = "<span class='text-primary' data-toggle='tooltip' title='" + term.Definition + "'>" + term.Term + "</span>";
			text = text.replace(regex, replacement);
		});
	}