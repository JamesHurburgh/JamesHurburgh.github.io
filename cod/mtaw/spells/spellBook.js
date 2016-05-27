$(document).ready(function () {
	$.ajaxSetup({
		beforeSend : function (xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});

	function loadJson(url, callback) {
		$.ajax({
			url : url,
			beforeSend : function (xhr) {
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType("application/json");
				}
			},
			dataType : 'json',
			async : true,
			data : null,
			error : function (xhr, status) {
				alert(status);
			},
			success : function (data, textStatus, request) {
				callback(data);
			}
		});
	}

	function readJson(url) {
		$.ajax({
			url : url,
			beforeSend : function (xhr) {
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType("application/json");
				}
			},
			dataType : 'json',
			async : true,
			data : null,
			error : function (xhr, status) {
				alert(status);
			},
			success : function (data, textStatus, request) {
				return data;
			}
		});
	}
	function ajax(url) {
	  return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
		  resolve(this.responseText);
		};
		xhr.dataType = 'json';
		xhr.async = true;
		xhr.data = null;
		xhr.overrideMimeType("application/json");
		xhr.onerror = reject;
		xhr.open('GET', url);
		xhr.send();
	  });
	}

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
		sel.append($("<option>").attr('value', 'Willpower').text('Willpower'));
	}

	function loadArcanumLevelComparators() {
		var sel = $('#arcanaLevelComparator');
		sel.append($("<option>").attr('value', '=').text('='));
		sel.append($("<option>").attr('value', '<=').text('<='));
	}

	function insertSpellData(json) {
		for (var i = 0; i < json.length; i++) {
			var params = jQuery.param({
					spell : escape(json[i].Name)
				});
			var nameLink = "<a target='_blank' href='spell.html\?" + params + "'>" + json[i].Name + "</a>";
			var bookName = json[i].SourceBook + ' p' + json[i].SourcePage;

			var arcanaFormatted = json[i].ArcanaRequirement;

			table.row.add([
					nameLink,
					bookName,
					arcanaFormatted,
					json[i].Practice,
					json[i].Action,
					json[i].Duration,
					json[i].Aspect,
					json[i].Cost,
					json[i].Effect.substr(0, 50) + "..."
				]).draw(); ;
		}
		spellsLoading = false;
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
		 .search( '' )
		 .columns().search( '' )
		 .draw();
	});
	
	// initialisation
	
	var spellsLoading = true;
	var loadingSpinner;
	
	function startLoadingSpinner(){
		$('#overlay').show();
		var opts = {
			  lines: 17 // The number of lines to draw
			, length: 28 // The length of each line
			, width: 21 // The line thickness
			, radius: 77 // The radius of the inner circle
			, scale: 1 // Scales overall size of the spinner
			, corners: 1 // Corner roundness (0..1)
			, color: '#000' // #rgb or #rrggbb or array of colors
			, opacity: 0 // Opacity of the lines
			, rotate: 0 // The rotation offset
			, direction: 1 // 1: clockwise, -1: counterclockwise
			, speed: 0.5 // Rounds per second
			, trail: 83 // Afterglow percentage
			, fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
			, zIndex: 2e9 // The z-index (defaults to 2000000000)
			, className: 'spinner' // The CSS class to assign to the spinner
			, top: '50%' // Top position relative to parent
			, left: '50%' // Left position relative to parent
			, shadow: false // Whether to render a shadow
			, hwaccel: false // Whether to use hardware acceleration
			, position: 'absolute' // Element positioning
			};
			loadingSpinner = new Spinner(opts).spin(document.getElementById('container'));
	}
	
	function stopLoadingSpinner(){
			$('#overlay').hide();
			loadingSpinner.stop();
	}
		
	startLoadingSpinner();

	table = $('#spellList').DataTable();

	$.getJSON( "data/spells.json")
	.done(function(data)	{ 
		insertSpellData(data); 
		})
	.done(function() 		{ stopLoadingSpinner(); })
	
	$.getJSON( "data/sourceBooks.json")
	.done(function(data)	{ loadSpellSources(data); })
	
	$.getJSON( "data/arcanum.json")
	.done(function(data)	{ loadArcanum(data); })
	
	$.getJSON( "data/practices.json")
	.done(function(data)	{ loadPractices(data); })
		
	loadArcanumLevels();
	loadArcanumLevelComparators();
	loadActions();
	loadDurations();
	loadAspects();
	loadCosts();

});