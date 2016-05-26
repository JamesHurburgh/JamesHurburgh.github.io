$(document).ready(function () {
	$.ajaxSetup({
		beforeSend : function (xhr) {
			if (xhr.overrideMimeType) {
				xhr.overrideMimeType("application/json");
			}
		}
	});

	loadJson = function (url, callback) {
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

	function loadSpellSources(data) {

		var sel = $('#sourceSelect');
		sel.append($("<option>").attr('value', '').text(''));
		$(data).each(function () {
			sel.append($("<option>").attr('value', this.Name).text(this.Name));
		});
	}

	function loadSpells() {
		$.ajax({
			url : 'spells.json',
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
				insertSpellData(data);
			}
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

	table = $('#spellList').DataTable();

	loadJson('data/spells.json', insertSpellData);
	loadJson('data/sourceBooks.json', loadSpellSources);
	loadJson('data/arcanum.json', loadArcanum);
	loadArcanumLevels();
	loadArcanumLevelComparators();
	loadJson('data/practices.json', loadPractices);
	loadActions();
	loadDurations();
	loadAspects();

	});
