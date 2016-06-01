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
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 1).text(1));
		sel.append($("<option>").attr('value', 2).text(2));
		sel.append($("<option>").attr('value', 3).text(3));
		sel.append($("<option>").attr('value', 4).text(4));
		sel.append($("<option>").attr('value', 5).text(5));
	}

	function loadActions() {
		var sel = $('#actionSelect');
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'Instant').text('Instant'));
		sel.append($("<option>").attr('value', 'Extended').text('Extended'));
		sel.append($("<option>").attr('value', 'Reflexive').text('Reflexive'));
		sel.append($("<option>").attr('value', 'Aimed').text('Aimed'));
	}

	function loadDurations() {
		var sel = $('#durationSelect');
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
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'Covert').text('Covert'));
		sel.append($("<option>").attr('value', 'Vulgar').text('Vulgar'));
	}

	function loadCosts() {
		var sel = $('#costSelect');
		sel.append($("<option>").attr('value', '').text(''));
		sel.append($("<option>").attr('value', 'None').text('None'));
		sel.append($("<option>").attr('value', 'Mana').text('Mana'));
		sel.append($("<option>").attr('value', 'Willpower').text('Willpower'));
		sel.append($("<option>").attr('value', 'Special').text('Special'));
	}

	function loadArcanumLevelComparators() {
		var sel = $('#arcanaLevelComparator');
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

	// Handlers
	$('#sourceSelect').change(function () {
		var searchTerm = $('#sourceSelect').val();
		table
		.columns(1)
		.search(searchTerm)
		.draw();
	});

	$('#arcanaSelect').change(function () {
		arcanaSearch();
	});

	$('#arcanaLevelSelect').change(function () {
		arcanaSearch();
	});

	$('#arcanaLevelComparator').change(function () {
		arcanaSearch();
	});

	$('#practiceSelect').change(function () {
		var searchTerm = $('#practiceSelect').val();
		table
		.columns(3)
		.search(searchTerm)
		.draw();
	});

	$('#actionSelect').change(function () {
		var searchTerm = $('#actionSelect').val();
		table
		.columns(4)
		.search(searchTerm)
		.draw();
	});

	$('#durationSelect').change(function () {
		var searchTerm = $('#durationSelect').val();
		table
		.columns(5)
		.search(searchTerm)
		.draw();
	});

	$('#aspectSelect').change(function () {
		var searchTerm = $('#aspectSelect').val();
		table
		.columns(6)
		.search(searchTerm)
		.draw();
	});

	$('#costSelect').change(function () {
		var searchTerm = $('#costSelect').val();
		table
		.columns(7)
		.search(searchTerm)
		.draw();
	});

	$('#clearFiltersButton').click(function () {
		$("#sourceSelect").val($("#sourceSelect option:first").val()).change();
		$("#arcanaSelect").val($("#arcanaSelect option:first").val()).change();
		$("#arcanaLevelSelect").val($("#arcanaLevelSelect option:first").val()).change();
		$("#practiceSelect").val($("#practiceSelect option:first").val()).change();
		$("#actionSelect").val($("#actionSelect option:first").val()).change();
		$("#durationSelect").val($("#durationSelect option:first").val()).change();
		$("#aspectSelect").val($("#aspectSelect option:first").val()).change();
		$("#costSelect").val($("#costSelect option:first").val()).change();
		table
		.search('')
		.columns().search('')
		.draw();
	});

	// initialisation

	var spellsLoading = true;
	var loadingSpinner;

	function startLoadingSpinner() {
		$('#overlay').show();
		var opts = {
			lines : 17 // The number of lines to draw
		,
			length : 28 // The length of each line
		,
			width : 21 // The line thickness
		,
			radius : 77 // The radius of the inner circle
		,
			scale : 1 // Scales overall size of the spinner
		,
			corners : 1 // Corner roundness (0..1)
		,
			color : '#000' // #rgb or #rrggbb or array of colors
		,
			opacity : 0 // Opacity of the lines
		,
			rotate : 0 // The rotation offset
		,
			direction : 1 // 1: clockwise, -1: counterclockwise
		,
			speed : 0.5 // Rounds per second
		,
			trail : 83 // Afterglow percentage
		,
			fps : 20 // Frames per second when using setTimeout() as a fallback for CSS
		,
			zIndex : 2e9 // The z-index (defaults to 2000000000)
		,
			className : 'spinner' // The CSS class to assign to the spinner
		,
			top : '50%' // Top position relative to parent
		,
			left : '50%' // Left position relative to parent
		,
			shadow : false // Whether to render a shadow
		,
			hwaccel : false // Whether to use hardware acceleration
		,
			position : 'absolute' // Element positioning
		};
		loadingSpinner = new Spinner(opts).spin(document.getElementById('container'));
	}

	function stopLoadingSpinner() {
		$('#overlay').hide();
		//loadingSpinner.stop();
	}

	function loadReferenceData(name) {
		if(!referenceDataStore.UseLocalStorage){
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
		} else if (storedReference.Version != latestReference.Version){
			alert('Refeshing store of ' + name + ' from version ' + storedReference.Version + ' to version ' + latestReference.Version);
			retrieveReferenceData(latestReference);
		}
	}
	
	function dontDoAnything(){
		storedReferenceData = store.get('storedReferenceData');
		if(!storedReferenceData){
			storedReferenceData = [];
		}
		var referenceDataUpdated = false;
		$(storedReferenceData).each(function (index, value) {
			if (value.Name == refDataDef.Name) {
				storedReferenceData[index] = refDataDef;
				referenceDataUpdated = true;
			}
		});
		if(!referenceDataUpdated){
			storedReferenceData.push(refDataDef);
		}
		store.set('storedReferenceData', storedReferenceData);
	}

	var latestReferenceData;

	//table = $('#spellList').DataTable();

	
	function loadTable(data){
		table = $('#spellList').DataTable( {
			data: data,
			columns: [
				{ data: 'Name',
					render: function ( data, type, row ) {
						return "<a target='_blank' href='spell.html\?spell=" + escape(row.Name) + "'>" + row.Name + "</a>";
					} 
				},
				{ 
					data: 'Source',
					render: function ( data, type, row ) {
						return row.SourceBook + ' p' + row.SourcePage;
					} 
				},
				{ data: 'ArcanaRequirement' },
				{ data: 'Practice' },
				{ data: 'Action' },
				{ data: 'Duration' },
				{ data: 'Aspect' },
				{ data: 'Cost' },
				{ 
					data: 'Effect' ,
					render: function ( data, type, row ) {
						return row.Effect.substr(0, 50) + "...";
					} 
				}
			]
		});
	}
			
	function retrieveReferenceData(shortName, path){
		var storedData = store.get(shortName);
		if(!storedData){
			$.getJSON(path, function (data) {
				storedData = store.set(shortName, data);
				return data;
			});
		}else{
			return storedData;
		}
	}
	
	function loadData(){
		
		$.when()	
		.then(	function() 		{ return retrieveReferenceData('spells', 'data/spells.json'); })
		//.then(	function(data) 	{ insertSpellData(data); })	
		.then(	function(data) 	{ loadTable(data); })	
		.done();
		
		$.when()	
		.then(	function() 		{ return retrieveReferenceData('sourceBooks', 'data/sourceBooks.json'); })
		.then(	function(data) 	{ loadSpellSources(data); })	
		.done();
		
		$.when()		
		.then(	function() 		{ return retrieveReferenceData('arcanum', 'data/arcanum.json'); })
		.then(	function(data) 	{ loadArcanum(data); })
		.done();
		
		$.when()	
		.then(	function() 		{ return retrieveReferenceData('practices', 'data/practices.json'); })
		.then(	function(data) 	{ loadPractices(data); })
		.done();
		
		loadArcanumLevels();
		loadArcanumLevelComparators();
		loadActions();
		loadDurations();
		loadAspects();
		loadCosts();	
	}
	
	// Kick everything off	
	$.when(startLoadingSpinner)	
	.then(loadData)
	.then(stopLoadingSpinner)
	.done();

});
