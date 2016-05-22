$(document).ready(function () {
	
		$.ajaxSetup({beforeSend: function(xhr){
		  if (xhr.overrideMimeType)
		  {
			xhr.overrideMimeType("application/json");
		  }
		}
		});
		
		loadJson = function ( url, callback ){
			$.ajax({
				url: url, 
				  beforeSend: function(xhr){
					if (xhr.overrideMimeType)
					{
					  xhr.overrideMimeType("application/json");
					}
				  },
				dataType: 'json',
				async: true,
				data: null,
				error: function (xhr, status) {
					alert(status);
				},
				success: function(data, textStatus, request) {
					callback(data);
				}
			});
		}
			
		loadSpellSources = function (data) {	
			
			var sel = $('#sourceSelect');
				sel.append($("<option>").attr('value','').text(''));
			$(data).each(function() {
				sel.append($("<option>").attr('value',this.Name).text(this.Name));
			});
		}
		
		loadSpells = function () {
			$.ajax({
				url: 'spells.json', 
				  beforeSend: function(xhr){
					if (xhr.overrideMimeType)
					{
					  xhr.overrideMimeType("application/json");
					}
				  },
				dataType: 'json',
				async: true,
				data: null,
				error: function (xhr, status) {
					alert(status);
				},
				success: function(data, textStatus, request) {
					insertSpellData(data);
				}
			});
		}
		
		loadPractices = function(data) {
			var sel = $('#practiceSelect');
				sel.append($("<option>").attr('value','').text(''));
			$(data).each(function() {
				sel.append($("<option>").attr('value',this.Name).text(this.Name));
			});
		}
		
		loadArcanum = function(data) {
			var sel = $('#arcanaSelect');
				sel.append($("<option>").attr('value','').text(''));
			$(data).each(function() {
				sel.append($("<option>").attr('value',this.Name).text(this.Name));
			});
		}
		
		insertSpellData = function (json) {
			for (var i = 0; i < json.length; i++) {
				var nameLink = "<a href='spell.html\?spell="+json[i].Name+"'>"+json[i].Name+"</a>";
				var nameLink = json[i].Name; // Until I get the spell page working use this.
				var bookName = json[i].SourceBook;
				var sourceBookLink = "<a href='http://www.drivethrurpg.com/browse.php?keywords=" + bookName + "'>"+bookName + " p" + json[i].SourcePage+"</a>";
				
				var arcanaFormatted = json[i]['Arcana Requirement'];
				
				table.row.add([ 
					nameLink, 
					sourceBookLink,
					arcanaFormatted,
					json[i].Practice,
					json[i].Action,
					json[i].Duration,
					json[i].Aspect,
					json[i].Cost,
					json[i].Effect.substr(0, 100) + "..."
					]).draw();;
			}
		}
		
		$(document).ready(function(){			
			table = $('#spellList').DataTable();
			
			loadJson('data/spells.json', insertSpellData);
			loadJson('data/sourceBooks.json', loadSpellSources);
			loadJson('data/practices.json', loadPractices);
			loadJson('data/arcanum.json', loadArcanum);
			
		});
		
		$('#sourceSelect').change(function() {
			var searchTerm = $('#sourceSelect').val();
			table
				.columns( 1 )
				.search( searchTerm )
				.draw();
		});
		
		$('#practiceSelect').change(function() {
			var searchTerm = $('#practiceSelect').val();
			table
				.columns( 3 )
				.search( searchTerm )
				.draw();
		});
		
		$('#arcanaSelect').change(function() {
			var searchTerm = $('#arcanaSelect').val();
			table
				.columns( 2 )
				.search( searchTerm )
				.draw();
		});
	});