$(document).ready(function () {
	
	// First Impressions
	var firstImpressions = [];
	
	// Settlement size
	var settlementSizeNumber = rollDice([4]);
	var settlementSizeChart = [
	{ roll:1, description: 'Settlement' },
	{ roll:2, description: 'Village' },
	{ roll:3, description: 'Town' },
	{ roll:4, description: 'City' }];
	var settlementSize = Enumerable.From(settlementSizeChart)
		.Where(function (x) { return x.roll ==  settlementSizeNumber })
		.FirstOrDefault()
		.description;
	
	// Starting population
	var startingPopulation = 0;
	switch(settlementSizeNumber){
		case 1: // Settlement (population 1-20)
			startingPopulation = rollDice([20]);
        break;
		case 2: // Village (population 21-100)
			startingPopulation = rollDice([20])+ (rollDice([4]) * 20);
        break;
		case 3: // Town (population 101-500)
			startingPopulation = rollDice([100])+ (rollDice([4]) * 100);
        break;
		case 4: // City (population 501-2500)
			startingPopulation = rollDice([500])+ (rollDice([4]) * 500);
        break;
	}
	firstImpressions.push("It is a " + settlementSize + " that looks like it might have been able to house " + startingPopulation + " people.");
	
	// How much overall damage is there?
	var overallDamageNumber = rollDice([4,4,4]);
	var overallDamageChart = [
	{ roll:3, description:'No damage. All services are functioning, and there are no signs that this has been affected.'},
	{ roll:4, description:'Residual damage. All services and roads are operational, however there may be some minor damage to private homes our businesses.'},
	{ roll:5, description:'Some damage. Some minor services or roads are damaged and some private houses or business have been destroyed.'},
	{ roll:6, description:'Major damage. Some important services and roads have been damaged, while some minor services and roads have been completely destroyed. Many private homes and businesses have been completely destroyed.'},
	{ roll:7, description:'Extensive damage. Many services and roads have been damaged, some completely destroyed.  There are some private homes and businesses that are only damaged, the rest are destroyed.'},
	{ roll:8, description:'Massive damage.  Most roads and services have been heavily damaged or destroyed. Those that remain have been heavily damaged. '},
	{ roll:9, description:'Extreme damage. Most buildings, roads and services have been completely destroyed. Few structures have even a single wall still standing.'},
	{ roll:10, description:'Catastrophic damage.  Everything has been completely destroyed. All that remains is the ruins of a settlement.  Though there may be some hardy people trying to utilise them.'},
	{ roll:11, description:'Complete destruction. The remains of civilisation are here, but nothing more. There is nothing of value to be had and the area is dangerous and unlivable.'},
	{ roll:12, description:'Annihilation. "The map says there\'s a town here, but I think it must be wrong." Landscape has completely changed or area is lethal, even to travel through.'}];
	var overallDamage = Enumerable.From(overallDamageChart)
		.Where(function (x) { return x.roll ==  overallDamageNumber })
		.FirstOrDefault()
		.description;
		
	// Damage Type
	var damageTypeNumber = rollDice([4,4,4,4,4]);
	var damageTypeChart = [
		{ roll:5, description:'Flood'},
		{ roll:6, description:'Nuclear fallout'},
		{ roll:7, description:'Fire'},
		{ roll:8, description:'Heavy storm'},
		{ roll:9, description:'Small scale avalanche or landslide'},
		{ roll:10, description:'Military action (i.e. Invasion or bombing/missile strikes)'},
		{ roll:11, description:'Tornado'},
		{ roll:12, description:'Tsunami'},
		{ roll:13, description:'Hurricane'},
		{ roll:14, description:'Massive flooding or mudslides'},
		{ roll:15, description:'Earthquake'},
		{ roll:16, description:'Bush or forest fires'},
		{ roll:17, description:'Massive scale avalanche or landslide'},
		{ roll:18, description:'Nuclear blast or meltdown'},
		{ roll:19, description:'Meteor strike'},
		{ roll:20, description:'Volcano'}];
	
	var damageType = Enumerable.From(damageTypeChart)
	.Where(function (x) { return x.roll ==  damageTypeNumber })
	.FirstOrDefault()
	.description;	
	firstImpressions.push("You see signs of a recent " + damageType);
	
	firstImpressions.push("It looks like the area has undergone " + overallDamage);
		
	// Display First Impressions to screen.
	$(firstImpressions).each(function(index, line){
		var divWrap = "<div>" + line + "</div>";
		$("#firstImpressions").append(divWrap);
	});
	
	// Population
	var population = [];
	
	var currentPopulation = Math.floor(startingPopulation / overallDamageNumber);
	population.push("It now looks like there are only " + currentPopulation + " people alive.");
	
	var startingTownVibeNumber = rollDice([4,4,4]);
	var startingTownVibeChart = [
		{ roll:3, description:'Pathetic'},
		{ roll:4, description:'Secretive'},
		{ roll:5, description:'Deluded'},
		{ roll:6, description:'Generous'},
		{ roll:7, description:'Vibrant'},
		{ roll:8, description:'Welcoming'},
		{ roll:9, description:'Industrious'},
		{ roll:10, description:'Discouraged'},
		{ roll:11, description:'Scheming'},
		{ roll:12, description:'Desperate'},
		];
	var startingTownVibe = Enumerable.From(startingTownVibeChart)
		.Where(function (x) { return x.roll ==  startingTownVibeNumber })
		.FirstOrDefault()
		.description;	
		
	var currentTownVibeNumber = rollDice([4,4,4]);
	var currentTownVibeChart = [
		{ roll:3, description:'Welcoming'},
		{ roll:4, description:'Industrious'},
		{ roll:5, description:'Discouraged'},
		{ roll:6, description:'Scheming'},
		{ roll:7, description:'Desperate'},
		{ roll:8, description:'Pathetic'},
		{ roll:9, description:'Secretive'},
		{ roll:10, description:'Deluded'},
		{ roll:11, description:'Generous'},
		{ roll:12, description:'Vibrant'}
		];
	var currentTownVibe = Enumerable.From(currentTownVibeChart)
		.Where(function (x) { return x.roll ==  currentTownVibeNumber })
		.FirstOrDefault()
		.description;
		
	population.push("The people seem different.  As if they were once " + startingTownVibe + ", but are now " + currentTownVibe + ".");
		
	// Display Population to screen.
	$(population).each(function(index, line){
		var divWrap = "<div>" + line + "</div>";
		$("#population").append(divWrap);
	});
	
	// Add people
	var people = [];
	for(var i = 0; i < currentPopulation; i++){
		people.push({
			Name : "John Smith",
			Age : rollDice([10,10,20,20,20])
		});
	}
	
	$(people).each(function(index, person){
		var divWrap = "<h5>" + person.Name + " (" + person.Age + ")</h5>";
		$("#population").append(divWrap);	
	});
});