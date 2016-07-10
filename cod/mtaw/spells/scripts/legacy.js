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
		name = legacy.Name;
		if(legacy.Nicknames && legacy.Nicknames[0]){
			name = name + " (" + legacy.Nicknames[0] + ")";
		}
		$('#LegacyName').text(name);

		hand = legacy.Hand.join(" & ").replace("R","Right-Handed").replace("L","Left-Handed");
		$('#Hand').text(hand);

		$('#Source').append(makePageLink(legacy.Sources[0].SourceBook, "book") + ' p' + legacy.Sources[0].SourcePage);
		
		getData("books", function(data){
			displayBook(data, legacy.Sources[0].SourceBook)
		});

		$('#Notes').text(legacyName.Notes);
		
		// Description
		descriptionTOC = $("<ul>");
		legacy.Sections.forEach(function(section) {
			title = $("<h4>").append(section.Title);
			title.attr("id", section.Title);
			paragraph = $("<p>").append(section.Text);
			//paragraph = $("<p").append(emphasiseText(section.Text));

			$('#Description').append(title);
			$('#Description').append(paragraph);

			link = $("<a>").append(section.Title);
			link.attr("href", "#" + section.Title);
			descriptionTOC.append($("<li>").append(link));
		}, this);
		$('#TableOfContents').append($("<li>Description</li>").append(descriptionTOC));

		// Attainments
		$('#Attainments').append(legacy.AttainmentDescription);
		attainmentsTOC = $("<ul>");
		legacy.Attainments.forEach(function(attainment) {
			
			// Title
			title = $("<h4>").append(attainment.Order + ": " + attainment.Name);
			title.attr("id", attainment.Name);
			
			// Table of Contents link
			link = $("<a>").append(attainment.Order + ": " + attainment.Name);
			link.attr("href", "#" + attainment.Name);
			attainmentsTOC.append($("<li>").append(link));

			// Prerequisites
			prerequisteList = $("<ul>");
			attainment.Prerequisites.forEach(function(prerequiste) {
				prerequisteList.append($("<li>").append(prerequiste));
			});

			// Description
			//description = $("<p>").append(attainment.Description);

			$('#Attainments').append(title);
			$('#Attainments').append("Prerequisites");
			$('#Attainments').append(prerequisteList);
		  
			//emphasiseText(attainment.Description, function(description){
				$('#Attainments').append($("<p>").append(attainment.Description));
			//});

		}, this);
		$('#TableOfContents').append($("<li>Attainments</li>").append(attainmentsTOC));
				
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
