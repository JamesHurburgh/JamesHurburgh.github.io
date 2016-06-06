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
	
	var sourceBooks;
	
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}
	
	function loadJson(url, callback) {
		$.ajax({
			url : url,
			beforeSend : function (xhr) {
				if (xhr.overrideMimeType) {
					xhr.overrideMimeType("application/json");
				}
			},
			dataType : 'json',
			async : true,
			data : null,
			error : function (xhr, status) {
				alert(status);
			},
			success : function (data, textStatus, request) {
				callback(data);
			}
		});
	}
	
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
				$('#SourceImage').attr( 'src', sourceBook.Image );
				
				$('#amazonLink').attr( 'href', sourceBook.Links.Amazon );
				$('#driveThruRpgLink').attr( 'href', sourceBook.Links.DriveThruRpg );
				$('#wikiaLink').attr( 'href', sourceBook.Links.Wikia );
			}
		});
		$("#Requirements").append(renderRequirements(spell.Requirements));
		$('#Practice').text(spell.Practice);
		$('#Action').text(spell.Action);
		$('#Duration').text(spell.Duration);
		$('#Aspect').text(spell.Aspect);
		$('#Cost').text(spell.Cost);
		$('#Notes').text(spell.Notes);
		
		// Turn spell names into links
		spellEffect = spell.Effect;
		$(spells).each(function (index, spell) {
			spellEffect = spellEffect.replace(this.Name, "<a href='spell.html\?spell=" + escape(spell.Name) + "'>" + spell.Name + "</a>");
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
	
	var spells;
	function loadSpell(data){
		spells = data;
		var spellName = getParameterByName('spell');
		$(data).each(function () {
			if(escape(this.Name) == spellName || this.Name == spellName){
				displaySpell(this);
			}
		});
		
		$(".spellLink").each( function() {
			//alert();
		});
	}
	
	loadJson('data/sourceBooks.json', loadSourceBooks);
	loadJson('data/spells.json', loadSpell);
	
});
