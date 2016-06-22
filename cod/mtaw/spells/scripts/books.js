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
					"url": "data/books.json",
					"dataSrc": ""
				},
				columns: [
					{ 
						data: 'Title',
						render: function ( data, type, book ) {							
							return book.Title;
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
							
							if(book.Links.Wikia)
							{
								links = links + "<a href='" + book.Links.Wikia + "' target='_blank' title='" + book.Title + "on WhiteWolf Wikia'><img src='http://www.google.com/s2/favicons?domain_url=www.wikia.com'/></a>"
							}else {
								links = links + "<a href='http://whitewolf.wikia.com/wiki/Special:Search?search=" + book.Title + "' target='_blank' title='Search for " + book.Title + " on WhiteWolf Wikia'><img src='http://www.google.com/s2/favicons?domain_url=www.wikia.com'/>?</a>"
							}
							
							if(book.Links.DriveThruRpg)
							{
								links = links + "<a href='" + book.Links.DriveThruRpg + "' target='_blank' title='" + book.Title + "on DriveThruRpg'><img src='http://www.google.com/s2/favicons?domain_url=www.drivethrurpg.com'/></a>"
							}else {
								links = links + "<a href='http://drivethrurpg.com/browse.php?keywords=" + book.Title + "' target='_blank' title='Search for " + book.Title + " on DriveThruRpg'><img src='http://www.google.com/s2/favicons?domain_url=www.drivethrurpg.com'/>?</a>"
							}
							
							if(book.Links.Amazon) 
							{
								links = links + "<a href='" + book.Links.Amazon + "' target='_blank' title='" + book.Title + "on Amazon'><img src='http://www.google.com/s2/favicons?domain_url=www.amazon.com'/></a>"}else {
								links = links + "<a href='https://www.amazon.com/s/ref=nb_sb_noss_2?url=search-alias%3Daps&field-keywords=" + book.Title + "' target='_blank' title='Search for " + book.Title + " on Amazon'><img src='http://www.google.com/s2/favicons?domain_url=www.amazon.com'/>?</a>"
							}
							
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
