$(document).ready(function () {

	// Initialise local storage
	function initStorage() {
		if (!store.enabled) {
			// TODO Pop-up warning once somehow.  Cookies maybe?
			return;
		}
	}
	initStorage();

	theme($('#themeSelect'), "Readable");

	// Setup Ajax calls
	// OBSOLETE
	$.ajaxSetup({
		beforeSend : function (xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});

	// Load drop down lists
	function loadSpellSources(data) {
		var sel = $('#sourceSelect');
		sel.append($("<option>").attr('value', '').text(''));
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadPractices(data) {
		var sel = $('#practiceSelect');
		sel.append($("<option>").attr('value', '').text(''));
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadArcanum(data) {
		var sel = $('#arcanaSelect');
		sel.append($("<option>").attr('value', '').text(''));
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadArcanumLevels() {
		var sel = $('#arcanaLevelSelect');
		sel.empty();
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 1).text(1));
		sel.append($("<option>").attr('value', 2).text(2));
		sel.append($("<option>").attr('value', 3).text(3));
		sel.append($("<option>").attr('value', 4).text(4));
		sel.append($("<option>").attr('value', 5).text(5));
	}

	function loadActions() {
		var sel = $('#actionSelect');
		sel.empty();
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'Instant').text('Instant'));
		sel.append($("<option>").attr('value', 'Extended').text('Extended'));
		sel.append($("<option>").attr('value', 'Reflexive').text('Reflexive'));
		sel.append($("<option>").attr('value', 'Aimed').text('Aimed'));
	}

	function loadDurations() {
		var sel = $('#durationSelect');
		sel.empty();
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'Concentration').text('Concentration'));
		sel.append($("<option>").attr('value', 'Instant').text('Instant'));
		sel.append($("<option>").attr('value', 'Lasting').text('Lasting'));
		sel.append($("<option>").attr('value', 'Prolonged').text('Prolonged'));
		sel.append($("<option>").attr('value', 'Special').text('Special'));
		sel.append($("<option>").attr('value', 'Transitory').text('Transitory'));
	}

	function loadAspects() {
		var sel = $('#aspectSelect');
		sel.empty();
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'Covert').text('Covert'));
		sel.append($("<option>").attr('value', 'Vulgar').text('Vulgar'));
	}

	function loadCosts() {
		var sel = $('#costSelect');
		sel.empty();
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'None').text('None'));
		sel.append($("<option>").attr('value', 'Mana').text('Mana'));
		sel.append($("<option>").attr('value', 'Willpower').text('Willpower'));
		sel.append($("<option>").attr('value', 'Special').text('Special'));
	}

	function loadAttributes(data) {
		var sel = $('#roteDicePoolSelect');
		sel.empty();
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadSkills(data) {
		var sel = $('#roteDicePoolSelect');
		sel.empty();
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadArcanumLevelComparators() {
		var sel = $('#arcanaLevelComparator');
		sel.empty();
		sel.append($("<option>").attr('value', '=').text('='));
		sel.append($("<option>").attr('value', '<=').text('<='));
	}

	function arcanaSearch() {
		var searchTerm = '"' + ($('#arcanaSelect').val() + ' ' + $('#arcanaLevelSelect').val()).trim() + '"';
		// var arcanaLevel = $('#arcanaLevelSelect').val();
		// var comparator = $('#arcanaLevelComparator').val();
		// arcanaLevel--;
		// while (comparator == "<=" && arcanaLevel != "" && arcanaLevel != 0){
		// 	searchTerm = searchTerm + 'OR "' + ($('#arcanaSelect').val() + ' ' + arcanaLevel).trim() + '"';
		// 	arcanaLevel--;
		// }
		table
		.columns(2)
		.search(searchTerm)
		.draw();
	}

	function addParam(paramName, paramValue) {
		if (paramValue && paramValue != '') {
			return '&' + paramName + '=' + encodeURIComponent(paramValue).replace(' ', '%20');
		}
		return "";
	}

	function applyParam(params, paramName, inputObject) {
		if (params[paramName] && params[paramName] != '') {
			inputObject.val(decodeURIComponent(params[paramName][0]));
			inputObject.change();
		}
	}

	function updateUrl() {
		currentUrl = window.location.href.split('?')[0];
		params = "";
		params = params + addParam("source", $('#sourceSelect').val());
		params = params + addParam("practice", $('#practiceSelect').val());
		params = params + addParam("action", $('#actionSelect').val());
		params = params + addParam("duration", $('#durationSelect').val());
		params = params + addParam("aspect", $('#aspectSelect').val());
		params = params + addParam("cost", $('#costSelect').val());
		params = params + addParam("arcanaFilterType", $('#arcanaFilterType').val());
		params = params + addParam("fateDots", $('#fateDots').val());
		params = params + addParam("forcesDots", $('#forcesDots').val());
		params = params + addParam("deathDots", $('#deathDots').val());
		params = params + addParam("lifeDots", $('#lifeDots').val());
		params = params + addParam("matterDots", $('#matterDots').val());
		params = params + addParam("mindDots", $('#mindDots').val());
		params = params + addParam("primeDots", $('#primeDots').val());
		params = params + addParam("spaceDots", $('#spaceDots').val());
		params = params + addParam("spiritDots", $('#spiritDots').val());
		params = params + addParam("timeDots", $('#timeDots').val());

		window.history.pushState("object or string", "Search", currentUrl + '?' + params);
	}

	function loadQueryParameters() {
		var params = getQuery();
		applyParam(params, "source", $('#sourceSelect'));
		applyParam(params, "practice", $('#practiceSelect'));
		applyParam(params, "action", $('#actionSelect'));
		applyParam(params, "duration", $('#durationSelect'));
		applyParam(params, "aspect", $('#aspectSelect'));
		applyParam(params, "cost", $('#costSelect'));
		applyParam(params, "arcanaFilterType", $("#arcanaFilterType"));
		applyParam(params, "fateDots", $('#fateDots'));
		applyParam(params, "forcesDots", $('#forcesDots'));
		applyParam(params, "deathDots", $('#deathDots'));
		applyParam(params, "lifeDots", $('#lifeDots'));
		applyParam(params, "matterDots", $('#matterDots'));
		applyParam(params, "mindDots", $('#mindDots'));
		applyParam(params, "primeDots", $('#primeDots'));
		applyParam(params, "spaceDots", $('#spaceDots'));
		applyParam(params, "spiritDots", $('#spiritDots'));
		applyParam(params, "timeDots", $('#timeDots'));
	}

	// Handlers
	$('#sourceSelect').change(function () {
		var searchTerm = $('#sourceSelect').val();
		table
		.columns(1)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	/*

	$('#arcanaSelect').change(function () {
	arcanaSearch();
	});

	$('#arcanaLevelSelect').change(function () {
	arcanaSearch();
	});

	$('#arcanaLevelComparator').change(function () {
	arcanaSearch();
	});

	 */

	$('#practiceSelect').change(function () {
		var searchTerm = $('#practiceSelect').val();
		table
		.columns(3)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	$('#actionSelect').change(function () {
		var searchTerm = $('#actionSelect').val();
		table
		.columns(4)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	$('#durationSelect').change(function () {
		var searchTerm = $('#durationSelect').val();
		table
		.columns(5)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	$('#aspectSelect').change(function () {
		var searchTerm = $('#aspectSelect').val();
		table
		.columns(6)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	$('#costSelect').change(function () {
		var searchTerm = $('#costSelect').val();
		table
		.columns(7)
		.search(searchTerm)
		.draw();
		updateUrl();
	});

	// Arcanum Filtering
	$('.arcana-search').change(function () {

		var searchTerm =
			'Fate-' + $('#fateDots').val()
			 + ' Forces-' + $('#forcesDots').val()
			 + ' Death-' + $('#deathDots').val()
			 + ' Life-' + $('#lifeDots').val()
			 + ' Matter-' + $('#matterDots').val()
			 + ' Mind-' + $('#mindDots').val()
			 + ' Prime-' + $('#primeDots').val()
			 + ' Space-' + $('#spaceDots').val()
			 + ' Spirit-' + $('#spiritDots').val()
			 + ' Time-' + $('#timeDots').val();

		if ($('#fateDots').val()
			 + $('#forcesDots').val()
			 + $('#deathDots').val()
			 + $('#lifeDots').val()
			 + $('#matterDots').val()
			 + $('#mindDots').val()
			 + $('#primeDots').val()
			 + $('#spaceDots').val()
			 + $('#spiritDots').val()
			 + $('#timeDots').val() == 0) {
			// This is the default value, all set to zero.  No spells will be shown if the search term isn't blanked out.
			searchTerm = 0;
		}
		
		if($("#arcanaFilterType").val() == "upto"){
			table.columns(11).search(searchTerm);
			table.columns(12).search("");
		}else if($("#arcanaFilterType").val() == "exactly"){
			table.columns(11).search("");
			table.columns(12).search(searchTerm);
		}
		
		table
		.draw();
		updateUrl();

	});

	$('#clearFiltersButton').click(function () {
		$("#sourceSelect").val($("#sourceSelect option:first").val()).change();
		//$("#arcanaSelect").val($("#arcanaSelect option:first").val()).change();
		//$("#arcanaLevelSelect").val($("#arcanaLevelSelect option:first").val()).change();
		$("#practiceSelect").val($("#practiceSelect option:first").val()).change();
		$("#actionSelect").val($("#actionSelect option:first").val()).change();
		$("#durationSelect").val($("#durationSelect option:first").val()).change();
		$("#aspectSelect").val($("#aspectSelect option:first").val()).change();
		$("#costSelect").val($("#costSelect option:first").val()).change();

		$('#fateDots').val(0);
		$('#forcesDots').val(0);
		$('#deathDots').val(0);
		$('#lifeDots').val(0);
		$('#matterDots').val(0);
		$('#mindDots').val(0);
		$('#primeDots').val(0);
		$('#spaceDots').val(0);
		$('#spiritDots').val(0);
		$('#timeDots').val(0);
		
		$("#arcanaFilterType").val("upto");

		table
		.search('')
		.columns().search('')
		.draw();
		updateUrl();
	});

	// initialisation
	var table;

	function loadReferenceData(name) {
		if (!referenceDataStore.UseLocalStorage) {
			return retrieveReferenceData(referenceDataStore.Dictionary[name]);
		}
		var storedReference;
		var latestReference;
		$(store.get('storedReferenceData')).each(function (index, value) {
			if (value.Name == name) {
				storedReference = value;
			}
		});
		$(latestReferenceData).each(function (index, value) {
			if (value.Name == name) {
				latestReference = value;
			}
		});
		if (latestReference == null) {
			alert('Cannot find reference data for: ' + name);
			return;
		}
		if (!storedReference || !store.get(name)) {
			alert('Getting version ' + latestReference.Version + ' of ' + name + ' for the first time.');
			retrieveReferenceData(latestReference);
		} else if (storedReference.Version != latestReference.Version) {
			alert('Refeshing store of ' + name + ' from version ' + storedReference.Version + ' to version ' + latestReference.Version);
			retrieveReferenceData(latestReference);
		}
	}

	function loadTable(data) {
		if (!table) {
			table = $('#spellList').DataTable({
					responsive : true,
					//data: data,
					"ajax" : {
						"url" : "data/spells.json",
						"dataSrc" : ""
					},
					columns : [{
							data : 'Name',
							render : function (data, type, spell) {
								return "<a target='_blank' href='spell.html\?spell=" + escape(spell.Name) + "'>" + spell.Name + "</a>";
							}
						}, {
							data : 'Source',
							render : function (data, type, spell) {
								return spell.SourceBook + ' p' + spell.SourcePage;
							}
						}, {
							data : 'Requirements',
							render : function (data, type, spell) {
								//return spell.ArcanaRequirement;
								return renderRequirements(data); // Put this back in once Arcana requirements search works properly
							}
						}, {
							data : 'Practice'
						}, {
							data : 'Action'
						}, {
							data : 'Duration'
						}, {
							data : 'Aspect'
						}, {
							data : 'Cost'
						}, {
							data : 'Effect',
							render : function (data, type, spell) {
								return spell.Effect;
							}
						}, {
							data : 'Rote',
							render : function (data, type, spell) {
								if (!spell.Rotes || !spell.Rotes[0])
									return "";
								return spell.Rotes[0].RoteName;
							}
						}, {
							data : 'Rote Dice Pool',
							render : function (data, type, spell) {
								if (!spell.Rotes || !spell.Rotes[0] || spell.Rotes[0].RoteName == "")
									return "";
								var resisted = "";
								var contested = "";
								rote = spell.Rotes[0];
								if (rote.RoteDicePool_Resisted) {
									resisted = " - " + rote.RoteDicePool_Resisted;
								}
								if (rote.RoteDicePool_Contested) {
									contested = " vs. " + rote.RoteDicePool_Contested;
								}
								var dicePool = rote.RoteDicePool_Attribute + " + " + rote.RoteDicePool_Skill + " + " + spell.PrimaryArcana + resisted + contested;
								return dicePool;
							}
						}, {
							data : 'CastableBy',
							render : function (data, type, spell) {
								return arcanaCastableBySearchTerms(spell.Requirements);
							}
						}, {
							data : 'ExactArcana',
							render : function (data, type, spell) {
								return arcanaExactlySearchTerms(spell.Requirements);
							}
						}
					]
				});
		} else {
			table.data = data;
		}
	}

	function retrieveReferenceData(shortName, path) {
		var storedData = store.get(shortName);
		if (!storedData) {
			$.getJSON(path, function (data) {
				storedData = store.set(shortName, data);
				return data;
			});
		} else {
			return storedData;
		}
	}

	function loadData() {

		$.when()
		.then(function () {
			return retrieveReferenceData('spells', 'data/spells.json');
		})
		//.then(	function(data) 	{ insertSpellData(data); })
		.then(function (data) {
			loadTable(data);
		})
		.done();

		$.when()
		.then(function () {
			return retrieveReferenceData('sourceBooks', 'data/sourceBooks.json');
		})
		.then(function (data) {
			loadSpellSources(data);
		})
		.done();

		$.when()
		.then(function () {
			return retrieveReferenceData('arcanum', 'data/arcanum.json');
		})
		.then(function (data) {
			loadArcanum(data);
		})
		.done();

		$.when()
		.then(function () {
			return retrieveReferenceData('practices', 'data/practices.json');
		})
		.then(function (data) {
			loadPractices(data);
		})	
		.done();

		$.when()
		.then(function () {
			return retrieveReferenceData('attributes', 'data/attributes.json');
		})
		.then(function (data) {
			loadAttributes(data);
		})	
		.done();

		$.when()
		.then(function () {
			return retrieveReferenceData('skills', 'data/skills.json');
		})
		.then(function (data) {
			loadSkills(data);
		})	
		.done();
		
		//.then(function() 	{ getData("attributes", function(data){attributes = data}); })	
		//.then(function() 	{ getData("skills", function(data){skills = data}); })	

		loadArcanumLevels();
		loadArcanumLevelComparators();
		loadActions();
		loadDurations();
		loadAspects();
		loadCosts();

		loadQueryParameters();

		// updateUrl();
	}

	// Kick everything off
	loadData();

});
