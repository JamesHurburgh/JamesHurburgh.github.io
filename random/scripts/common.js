$(document).ready(function () {
	
	// Initialise local storage
	function initStorage() {
		if (!store.enabled) {
			// TODO Pop-up warning once somehow.  Cookies maybe?
			return;
		}
	}
	initStorage();
	
	//theme($('#themeSelect'), "Cyborg");	
});
	
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function rollDice(diceArray){
	var total = 0;
	$(diceArray).each(function(index, die){
		total = total + getRandomInt(1, die);
	});
	return total;
}

// function lookupRollChart(roll, chart){
// 	return Enumerable.From(chart)
// 	.Where(function (x) { return x.roll ==  roll })
// 	.FirstOrDefault()
// 	.description;		
// }