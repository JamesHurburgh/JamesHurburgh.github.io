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
	$("c").text("&copy;");
	
	// initialisation
	var table;
	function loadTable(){
		if(!table){
			table = $('#legacies').DataTable( {
				responsive: true,
				"ajax": {
					"url": "data/legacies.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Name',
						render : function (data, type, legacy) {
							return makePageLink(legacy.Name, "legacy");
						}
					},
					{
						data : 'Source',
						render : function (data, type, legacy) {
							return makeBookLink(legacy.Sources[0].SourceBook) + ' p' + legacy.Sources[0].SourcePage;
						}
					},
					{
						data : 'Handed',
						render : function (data, type, legacy) {							
							return legacy.Hand.join(" & ").replace("R","Right-Handed").replace("L","Left-Handed");
						}
					},
					{
						data : 'Order',
						render : function (data, type, legacy) {
							return legacy.Order.join(" or ");
						}
					},
					{
						data : 'Path',
						render : function (data, type, legacy) {
							return legacy.Path.join(" or ");
						}
					},
					{
						data : 'Arcana',
						render : function (data, type, legacy) {
							return legacy.Arcana.join(" & ");
						}
					},
					{
						data : 'Description',
						render : function (data, type, legacy) {
							if(!legacy.Sections || !legacy.Sections[0]){
								return "";
							}
							return legacy.Sections[0].Text;
						}
					}
				]
			});
		}else{
			table.data = data;
		}
	}

	loadTable();
	
});