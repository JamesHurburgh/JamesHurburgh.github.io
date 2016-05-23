$(document).ready(function () {

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
	
	function displaySpell(spell){
		$('#SpellName').text(spell.Name);
		$('#PrimaryArcana').text(spell.PrimaryArcana);
		$('#Source').text(spell.SourceBook + ' p' + spell.SourcePage);
		$('#ArcanaRequirements').text(spell.ArcanaRequirement);
		$('#Practice').text(spell.Practice);
		$('#Action').text(spell.Action);
		$('#Duration').text(spell.Duration);
		$('#Aspect').text(spell.Aspect);
		$('#Cost').text(spell.Cost);
		$('#Effect').text(spell.Effect);
		
		// TODO account for multiple rotes
		var rote = spell.Rotes[0];
		if(rote){
			$('#RoteName').text(rote.RoteName);
			$('#RoteOrder').text(rote.RoteOrder);
			$('#RoteDicePool').text(rote.RoteDicePool_Attribute + " + " + rote.RoteDicePool);
			$('#RoteDescription').text(rote.RoteDescription);
				
		}
		
	}
	
	function loadSpell(data){
		var spellName = getParameterByName('spell');
		$(data).each(function () {
			if(this.Name == spellName){
				displaySpell(this);
			}
		});
	}
	
	loadJson('data/spells.json', loadSpell);
	
});