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
		$('#Source').text(spell.SourceBook + ' p' + spell.SourcePage);
		$('#ArcanaRequirements').text(spell['Arcana Requirement']);
		$('#Practice').text(spell.Practice);
		$('#Action').text(spell.Action);
		$('#Duration').text(spell.Duration);
		$('#Aspect').text(spell.Aspect);
		$('#Cost').text(spell.Cost);
		$('#Effect').text(spell.Effect);
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