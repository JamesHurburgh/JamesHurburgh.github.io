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

	
	
	
	function displayBook(book){
		
		document.title = book.Title;
		$('#BookTitle').text(book.Title);
		var safeTitle = book.Title.removeAll(" ").removeAll(":");
		var safeGameLine = book.GameLine.removeAll(" ").removeAll(":");
		$('#GameLine').text(book.GameLine);
		
		// $('#container').addClass(safeGameLine); // TODO: put this back in once css is looking good.
		
		var bookId = book.ID;
		if(!bookId || bookId == ""){ 
			bookId = safeTitle; 
		}
		var imgUrl = 'images/covers/thumbs/' + bookId + '.png';
		$('#CoverThumbnail').attr( 'src', imgUrl);
		
		// Get Affiliate Links
		var links = "";		
		links = links + getAffiliateLink("WhiteWolf Wikia", book.Links.Wikia, book.Title);
		links = links + getAffiliateLink("DriveThruRpg", book.Links.DriveThruRpg, book.Title);
		links = links + getAffiliateLink("Amazon", book.Links.Amazon, book.Title);
		
		$('#AffiliateLinks').text("");
		$('#AffiliateLinks').append(links);
	}
	
	function loadBooks(data){
		sourceBooks = data;
		var bookTitle = getParameterByName('book');
		$(data).each(function () {
			if(escape(this.Title) == bookTitle || this.Title == bookTitle){
				displayBook(this);
			}
		});
	}
	
	var sourceBooks;
	var spells;
	var arcanum;
	var glossary;
	var infoBoxes;
	var attributes;
	var skills;
	
	$.when()	
	.then(	function() 	{ getData("arcanum", function(data){arcanum = data}); })
	.then(	function() 	{ getData("glossary", function(data){glossary = data}); })	
	.then(	function() 	{ getData("infoBoxes", function(data){infoBoxes = data}); })	
	.then(	function() 	{ getData("attributes", function(data){attributes = data}); })	
	.then(	function() 	{ getData("skills", function(data){skills = data}); })	
	.then(	function() 	{ getData("books", loadBooks); })	
	.done();
	
});
