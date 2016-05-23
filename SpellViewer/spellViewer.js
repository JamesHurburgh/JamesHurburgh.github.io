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
	
	
		loadSpellSources = function (data) {

			var sel = $('#sourceSelect');
			sel.append($("<option>").attr('value', '').text(''));
			$(data).each(function () {
				sel.append($("<option>").attr('value', this.Name).text(this.Name));
			});
		},

		loadSpells = function () {
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
		},

		loadPractices = function (data) {
			var sel = $('#practiceSelect');
			sel.append($("<option>").attr('value', '').text(''));
			$(data).each(function () {
				sel.append($("<option>").attr('value', this.Name).text(this.Name));
			});
		},

		loadArcanum = function (data) {
			var sel = $('#arcanaSelect');
			sel.append($("<option>").attr('value', '').text(''));
			$(data).each(function () {
				sel.append($("<option>").attr('value', this.Name).text(this.Name));
			});
		},

		loadArcanumLevels = function () {
			var sel = $('#arcanaLevelSelect');
			sel.append($("<option>").attr('value', '').text(''));
			sel.append($("<option>").attr('value', 1).text(1));
			sel.append($("<option>").attr('value', 2).text(2));
			sel.append($("<option>").attr('value', 3).text(3));
			sel.append($("<option>").attr('value', 4).text(4));
			sel.append($("<option>").attr('value', 5).text(5));
		},

		loadArcanumLevelComparators = function () {
			var sel = $('#arcanaLevelComparator');
			sel.append($("<option>").attr('value', '=').text('='));
			sel.append($("<option>").attr('value', '<=').text('<='));
		},

		insertSpellData = function (json) {
			for (var i = 0; i < json.length; i++) {
				var nameLink = "<a target='_blank' href='spell.html\?spell=" + json[i].Name + "'>" + json[i].Name + "</a>";
				// var nameLink = json[i].Name; // Until I get the spell page working use this.
				var bookName = json[i].SourceBook;
				var sourceBookLink = "<a href='http://www.drivethrurpg.com/browse.php?keywords=" + bookName + "'>" + bookName + " p" + json[i].SourcePage + "</a>";

				var arcanaFormatted = json[i].ArcanaRequirement;

				table.row.add([
						nameLink,
						sourceBookLink,
						arcanaFormatted,
						json[i].Practice,
						json[i].Action,
						json[i].Duration,
						json[i].Aspect,
						json[i].Cost,
						json[i].Effect.substr(0, 50) + "..."
					]).draw(); ;
			}
		},

		arcanaSearch = function () {
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
		};

	$('#sourceSelect').change(function () {
		var searchTerm = $('#sourceSelect').val();
		table
		.columns(1)
		.search(searchTerm)
		.draw();
	});

	$('#practiceSelect').change(function () {
		var searchTerm = $('#practiceSelect').val();
		table
		.columns(3)
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

	table = $('#spellList').DataTable();

	loadJson('data/spells.json', insertSpellData);
	loadJson('data/sourceBooks.json', loadSpellSources);
	loadJson('data/practices.json', loadPractices);
	loadJson('data/arcanum.json', loadArcanum);
	loadArcanumLevels();
	loadArcanumLevelComparators();

	});
