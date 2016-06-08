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
			table = $('#glossary').DataTable( {
				responsive: true,
				"ajax": {
					"url": "data/glossary.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Term'
					},
					{ 
						data: 'Definition'
					}
				]
			});
		}else{
			table.data = data;
		}
	}

	loadTable();
	
});
