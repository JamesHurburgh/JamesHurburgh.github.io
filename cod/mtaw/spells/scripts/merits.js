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
	
	// initialisation
	var table;
	function loadTable(){
		if(!table){
			table = $('#merits').DataTable( {
				responsive: true,
				"ajax": {
					"url": "data/merits.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Name',
						render: function ( data, type, merit ) {
							return merit.DisplayName;
						} 
					},
					{ 
						data: 'Source',
						render: function ( data, type, merit ) {
								return merit.SourceBook + ' p' + merit.SourcePage;
						} 
					},
					{ 
						data: 'Category'
					},
					{ 
						data: 'Prerequisite',
						render: function ( data, type, merit ) {
							if(merit.Prerequisite)
							{
								return merit.Prerequisite;
							}
							return "None";
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
