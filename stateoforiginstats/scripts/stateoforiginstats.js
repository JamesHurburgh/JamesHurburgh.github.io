$(document).ready(function () {
	
	// initialisation
	var table;
	function loadTable(){
		if(!table){
			table = $('#games').DataTable( {
				responsive: true,
				"ajax": {
					"url": "data/games.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Date'
					},
					{ 
						data: 'Details',
						render: function ( data, type, game ) {
							if(!game.Details) { return ""; }
							return game.Details;
						} 
					},
					{ 
						data: 'Referees'
					},
					{ 
						data: 'Ground'
					},
					{ 
						data: 'Crowd'
					},
					{ 
						data: 'Man of the Match',
						render: function ( data, type, game ) {
							if(!game.ManOfTheMatch) { return ""; }
							return game.ManOfTheMatch;
						} 
					},
				]
			});
		}else{
			table.data = data;
		}
	}

	loadTable();
	
});
