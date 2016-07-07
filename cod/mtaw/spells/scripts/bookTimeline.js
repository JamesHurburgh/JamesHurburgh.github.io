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
	
	var books;
	
	$.when()	
	.then(	function() 	{ getData("books", function(data){
		buildTimeline(data);
		}); })
	.done();
	
	function buildTimeline(bookData) {		
		var timelineJSON = {"events" : []};
		bookData.forEach(function(book, index) {
			var bookId = book.ID;
			if(!bookId || bookId == ""){ 
				bookId = book.Title.replace(new RegExp(" ", "g"), ""); 
			}
			var imgUrl = 'images/covers/thumbs/' + bookId + '.png';
			var year = book.Published.split("-")[0];
			var month = book.Published.split("-")[1];
			var day = book.Published.split("-")[2];
			timelineJSON.events.push(
				{
				"media": {
				  "url": imgUrl,
				  "caption": bookId
				},
				"start_date": {
				  "year": book.Published.split("-")[0] ? book.Published.split("-")[0] : null,
				  "month": book.Published.split("-")[1] ? book.Published.split("-")[1] : null,
				  "day": book.Published.split("-")[2] ? book.Published.split("-")[2] : null,
				},
				"text": {
				  "headline": book.Title,
				  "text": "<p><strong>ISBN</strong> " + book.ISBN + "</p>"
				}
			  }
		  );
		});
		loadTimeline(timelineJSON)
	}
		
	function loadTimeline(timelineJSON) {
		// initialisation
			  // The TL.Timeline constructor takes at least two arguments:
			  // the id of the Timeline container (no '#'), and
			  // the URL to your JSON data file or Google spreadsheet.
			  // the id must refer to an element "above" this code,
			  // and the element must have CSS styling to give it width and height
			  // optionally, a third argument with configuration options can be passed.
			  // See below for more about options.
			  timeline = new TL.Timeline('timeline-embed', timelineJSON);
				//'https://docs.google.com/spreadsheets/d/1cWqQBZCkX9GpzFtxCWHoqFXCHg-ylTVUWlnrdYMzKUI/pubhtml');
	}
	
});
