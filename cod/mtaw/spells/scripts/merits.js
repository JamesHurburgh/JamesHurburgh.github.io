$(document).ready(function () {

	// Initialise local storage
	function initStorage() {
		if (!store.enabled) {
			// TODO Pop-up warning once somehow.  Cookies maybe?
			return;
		}
	}
	initStorage();
	
	
	$("nav").load("webParts/menu.html");
	$("footer").load("webParts/footer.html", function(){
		theme($('#themeSelect'), "Readable");
	});
	
	// initialisation
	var table;
	function loadTable(){
		if(!table){
			table = $('#merits').DataTable( {
				responsive: true,
				"ajax": {
					"url": "data/merits2.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Name',
						render: function ( data, type, merit ) {							
							return merit.Name;
						} 
					},
					{ 
						data: 'Source',
						render: function ( data, type, merit ) {
								if(!merit.Sources){ return "";}
								var sourceList = "";
								$(merit.Sources).each(function (index, source){
									if(sourceList != "") {sourceList = sourceList + " & ";}
									sourceList = sourceList + source.SourceBook + ' p' + source.SourcePage
								});
								return sourceList;
						} 
					},
					{ 
						data: 'Category'
					},
					{ 
						data: 'Levels'
					},
					{ 
						data: 'Prerequisites',
						render: function ( data, type, merit ) {
							if(!merit.Prerequistes) { return "None"; }
							return merit.Prerequistes;
						} 
					},
					{ 
						data: 'Effect'
					}
				]
			});
		}else{
			table.data = data;
		}
	}

	loadTable();
	
});
