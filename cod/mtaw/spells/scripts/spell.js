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
	
	
	function loadSourceBooks(data) {
		sourceBooks = data;
	}
	
	function displaySpell(spell){
		
		document.title = spell.Name;
		$('#SpellName').text(spell.Name);
		$('#PrimaryArcana').text(spell.PrimaryArcana);
		$('#Source').text(spell.SourceBook + ' p' + spell.SourcePage);
		
		sourceBooks.forEach(function( sourceBook, index ) {
			if(sourceBook.Name == spell.SourceBook){
				if(sourceBook.ID){
					$('#SourceImageThumbnail').attr( 'src', 'images/covers/' + sourceBook.ID + '-t.png' );
					$('#SourceLink').attr( 'href', 'images/covers/' + sourceBook.ID + '.png' );
				}else{					
					$('#SourceImageThumbnail').attr( 'src', sourceBook.Image );
					$('#SourceLink').attr( 'href', sourceBook.Image );
				}
				
				// Amazon Link
				if(sourceBook.Links.Amazon){
					$('#amazonLink').attr( 'href', sourceBook.Links.Amazon );
				}else{
					$('#amazonLink').hide();
				}
				
				// Drive Thru Rpg Link
				if(sourceBook.Links.DriveThruRpg){
					$('#driveThruRpgLink').attr( 'href', sourceBook.Links.DriveThruRpg );
				}else{
					$('#driveThruRpgLink').hide();
				}
				
				// White Wolf Wikia Link
				if(sourceBook.Links.Wikia){
					$('#wikiaLink').attr( 'href', sourceBook.Links.Wikia );
				}else{
					$('#wikiaLink').hide();
				}
			}
		});
		$("#Requirements").append(renderRequirements(spell.Requirements));
		$('#Practice').text(spell.Practice);
		$('#Action').text(spell.Action);
		$('#Duration').text(spell.Duration);
		$('#Aspect').text(spell.Aspect);
		$('#Cost').text(spell.Cost);
		$('#Notes').text(spell.Notes);
		
		spellEffect = spell.Effect;
		// Turn spell names into links
		$(spells).each(function (index, spell) {
			spellEffect = spellEffect.replace(new RegExp('\b'+spell.Name+'\b'), "<a href='spell.html\?spell=" + escape(spell.Name) + "'>" + spell.Name + "</a>");
		});
		
		// Emphasise Arcana names
		$(arcanum).each(function (index, arcana) {
			spellEffect = spellEffect.replace(new RegExp(arcana.Name, "g"), "<strong>" + arcana.Name + "</strong>");
		});
		
		// Popover text for glossary
		$(glossary).each(function (index, term) {
			regex = new RegExp('(\\b' + term.Term + '\\b)(?![^<]*>|[^<>]*</)');
			replacement = "<a href='#' data-toggle='popover' title='" + term.Definition + "'>" + term.Term + "</a>";
			spellEffect = spellEffect.replace(regex, replacement);
			// <a href="#" data-toggle="popover" title="Popover Header" data-content="" + term.Definition + "">" + term.Term + "</a>
		});
		
		$('#Effect').append(spellEffect);
		
		
		// TODO account for multiple rotes
		var rote = spell.Rotes[0];
		if(rote){
			var resisted = "";
			var contested = "";
			if(rote.RoteDicePool_Resisted){
				resisted = " - " + rote.RoteDicePool_Resisted;
			}
			if(rote.RoteDicePool_Contested){
				contested = " vs. " + rote.RoteDicePool_Contested;
			}
			var dicePool = rote.RoteDicePool_Attribute + " + " + rote.RoteDicePool_Skill + " + " + spell.PrimaryArcana + resisted + contested;
			$('#RoteName').text(rote.RoteName);
			$('#RoteOrder').text(rote.RoteOrder);
			$('#RoteDicePool').text(dicePool);
			$('#RoteDescription').text(rote.RoteDescription);				
		}		
	}
	
	function loadSpell(data){
		spells = data;
		var spellName = getParameterByName('spell');
		$(data).each(function () {
			if(escape(this.Name) == spellName || this.Name == spellName){
				displaySpell(this);
			}
		});
	}
	
	var sourceBooks;
	var spells;
	var arcanum;
	var glossary;
	
	$.when()	
	.then(	function() 	{ getData("arcanum", function(data){arcanum = data}); })
	.then(	function() 	{ getData("sourceBooks", function(data){sourceBooks = data}); })
	.then(	function() 	{ getData("glossary", function(data){glossary = data}); })	
	.then(	function() 	{ getData("spells", loadSpell); })	
	.then(	function() 	{ $("[data-toggle='popover']").popover(); })	
	.then(	function() 	{ $("[data-toggle='tooltip']").tooltip(); })	
	.done();
	
});
