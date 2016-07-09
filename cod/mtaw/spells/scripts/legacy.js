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

	function displayBook(data, bookTitle){
		data.forEach(function( book, index ) {
			if(book.Title == bookTitle){
				var bookId = book.ID;
				if(!bookId || bookId == ""){ 
					bookId = book.Title.replace(new RegExp(" ", "g"), ""); 
				}							
				if(bookId){
					$('#SourceImageThumbnail').attr( 'src', 'images/covers/thumbs/' + bookId + '.png' );
					$('#SourceLink').attr( 'href', 'images/covers/' + bookId + '.png' );
				}else{					
					$('#SourceImageThumbnail').attr( 'src', book.Image );
					$('#SourceLink').attr( 'href', book.Image );
				}

				// Get Affiliate Links
				var links = "";		
				links = links + getAffiliateLink("WhiteWolf Wikia", book.Links.Wikia, book.Title);
				links = links + getAffiliateLink("DriveThruRpg", book.Links.DriveThruRpg, book.Title);
				links = links + getAffiliateLink("Amazon", book.Links.Amazon, book.Title);
				
				$('#AffiliateLinks').text("");
				$('#AffiliateLinks').append(links);
			}
		});
	}
	
	function displayLegacy(legacy){
		
		document.title = legacy.Name;
		$('#LegacyName').text(legacy.Name);

		$('#Source').append(makePageLink(legacy.Sources[0].SourceBook, "book") + ' p' + legacy.Sources[0].SourcePage);
		
		getData("books", function(data){
			displayBook(data, legacy.Sources[0].SourceBook)
		});

		$('#Notes').text(legacyName.Notes);
		

		legacy.Sections.forEach(function(section) {
			title = $("<h4>").append(section.Title);
			title.attr("id", section.Title);
			paragraph = $("<p>").append(section.Text);
			//paragraph = $("<p").append(emphasiseText(section.Text));

			$('#Description').append(title);
			$('#Description').append(paragraph);

			link = $("<a>").append(section.Title);
			link.attr("href", "#" + section.Title);
			$('#TableOfContents').append($("<li>").append(link));
		}, this);
				
	}

	function emphasiseText(text){

		// Insert infoBoxes
		$(infoBoxes).each(function(index, inset) {
			if(inset.Type == "html"){
				var replacementText = '<div class="well">' + inset.html + '</div>';
				text = text.replace(inset.PlacementText, replacementText);
			}
		});
		
		// Turn spell names into links
		$(spells).each(function (index, spell) {
			text = text.replace(new RegExp('\\b'+spell.Name+'\\b'), "<a href='spell.html\?spell=" + escape(spell.Name) + "'>" + spell.Name + "</a>");
		});
		
		// Emphasise Arcana names
		$(arcanum).each(function (index, arcana) {
			text = text.replace(new RegExp(arcana.Name, "g"), "<strong>" + arcana.Name + "</strong>");
		});
		
		// Emphasise Attributes names
		$(attributes).each(function (index, attribute) {
			text = text.replace(new RegExp(attribute.Name, "g"), "<strong>" + attribute.Name + "</strong>");
		});
		
		// Emphasise Attributes names
		$(skills).each(function (index, skill) {
			text = text.replace(new RegExp(skill.Name, "g"), "<strong>" + skill.Name + "</strong>");
		});
		
		// Popover text for glossary
		$(glossary).each(function (index, term) {
			regex = new RegExp('(\\b' + term.Term + '\\b)(?![^<]*>|[^<>]*</)');
			replacement = "<span class='text-primary' data-toggle='tooltip' title='" + term.Definition + "'>" + term.Term + "</span>";
			text = text.replace(regex, replacement);
		});
	}
	
	function loadLegacy(data){
		legacyName = getParameterByName('legacy');
		$(data).each(function () {
			if(escape(this.Name) == legacyName || this.Name == legacyName){
				displayLegacy(this);
			}
		});
	}

	getData("legacies", loadLegacy);
	
});
