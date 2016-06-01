
var UNFILLED_CIRCLE = "⚪";
var FILLED_CIRCLE = "⚫";


function renderRequirements(requirements){
	var requirementList = '';
	if(requirements){
		arcanum = ['Fate','Forces','Death','Life','Matter','Mind','Prime','Space','Spirit','Time'];
		for(var i = 0; i < arcanum.length; i++){
			required = 0;
			optional = 0;
			requirements.forEach(function( requirement, index ) {
				if(requirement.Name == arcanum[i] && requirement.Optional != 'True'){
					required = requirement.Dots;
				}
				if(requirement.Name == arcanum[i] && requirement.Optional == 'True'){
					optional = requirement.Dots;
				}
			});
			var optionalExtra = Math.max(0, optional - required);
			if(required+optionalExtra > 0){
				requirementList = requirementList + '<div>' + arcanum[i] + ' ' + Array(parseInt(required)+1).join(FILLED_CIRCLE)+Array(parseInt(optionalExtra)+1).join(UNFILLED_CIRCLE) + "</div>";
			}
		}
	}
	return requirementList;
}