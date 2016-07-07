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
					"url": "data/books.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Title',
						render: function ( data, type, book ) {	
							return "<a target='_blank' href='book.html\?book=" + escape(book.Title) + "'>" + book.Title + "</a>";		
						} 
					},
					{ 
						data: 'Cover',
						render: function ( data, type, book ) {
							var bookId = book.ID;
							if(!bookId || bookId == ""){ 
								bookId = book.Title.replace(new RegExp(" ", "g"), ""); 
							}							
							return "<a href='images/covers/" + bookId + ".png'><img src='images/covers/thumbs/" + bookId + ".png' width ='100px'/></a>";
						} 
					},
					{ 
						data: 'Game Line',
						render: function ( data, type, book ) {
							if(!book.GameLine) { return ""; }
							return book.GameLine;
						} 
					},
					{ 
						data: 'Published',
						render: function ( data, type, book ) {
							if(!book.Published) { return ""; }
							return book.Published;
						} 
					},
					{ 
						data: 'ID',
						render: function ( data, type, book ) {
							if(!book.ID) { return ""; }
							return book.ID;
						} 
					},
					{ 
						data: 'ISBN',
						render: function ( data, type, book ) {
							if(!book.ISBN) { return ""; }
							return book.ISBN;
						} 
					},
					{ 
						data: 'Links',
						render: function ( data, type, book ) {
							if(!book.Links) { return ""; }
							var links = "";
							
							links = links + getAffiliateLink("WhiteWolf Wikia", book.Links.Wikia, book.Title);
							links = links + getAffiliateLink("DriveThruRpg", book.Links.DriveThruRpg, book.Title);
							links = links + getAffiliateLink("Amazon", book.Links.Amazon, book.Title);
							
							return links;
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
