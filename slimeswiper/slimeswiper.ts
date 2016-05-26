/// <reference path="jquery.d.ts" />

// Initialise everything
var version = 0.1;
var log = log4javascript.getDefaultLogger();
function initialise(){
	log.info("Slime swiper version " + version);
	$("#version")[0].innerHTML = version;
	startTimer();
	redrawCosts();	
}
// Finished initialising

// Set the element cursor
var cursorPositionX;
var cursorPositionY;

var ElementCursor = {
    cursorElement: "",
    setCursor: function (cursorId) {
        $('html').css({
            'cursor': 'none'
        });
        ElementCursor.cursorElement = cursorId;
        ElementCursor.updateCursor();
    },
    removeCursor: function () {
        $('html').css({
            'cursor': ''
        });
        ElementCursor.cursorElement = '';
    },
    updateCursor: function () {
        $(document).mousemove(function (e) {
        	cursorPositionX = e.pageX;
        	cursorPositionY = e.pageY;
            //log.debug("mousemove");
            var width = $('#' + ElementCursor.cursorElement).width();
            var height = $('#' + ElementCursor.cursorElement).height();
            //width=0;
            //height=0;
            $('#' + ElementCursor.cursorElement).css({
                'position': 'fixed',
                    'top': e.pageY - (height/2) + 'px',
                    'left': e.pageX - (width/2) + 'px',
                    'z-index': -1000
            });
            doCursorMove();
        });
    }
};
ElementCursor.setCursor("cursor");

// Finished setting the element cursor

var slimeOnCursor = 1;
var maxSlimeOnCursor = 200;
var baseSlimeAdditionPerMove = 1;
var baseSlimeMultiplierPerMove = 1;
var totalSlimeCollected = 1;

var currentSelfReplicatingSlimeLevel = 0;
var SRSCost = 150;
var SRSCostInflation = 5.23;
var SRSIncrement = 1;

var baseSlimeAdditionPerMove = 1;
var moveReactionCost = 500;
var moveReactionCostInflation = 3.38;
var moveReactionIncrement = 2;

var currentSlimeDensity = 1;
var densityCost = 1000;
var densityCostInflation = 2.23;
var densityUpgradePortion = 0.95;

function upgradeDensity(){
    log.debug("upgradeDensity");
    if(slimeOnCursor < densityCost){return;}
    slimeOnCursor -= densityCost;
    
    // After the cost has been paid the volume of slime will increase because of the lower density.
    currentSlimeMass = currentSlimeDensity * slimeOnCursor;
    currentSlimeDensity *= densityUpgradePortion;
    slimeOnCursor = Math.floor(currentSlimeMass / currentSlimeDensity);
    densityCost = Math.floor(densityCost * densityCostInflation)
    
    redrawCosts();
    redrawCursor();
    recalculateAvailableUpgrades();
}

function upgradeSRS(){
    log.debug("upgradeSRS");
    if(slimeOnCursor < SRSCost){return;}
    slimeOnCursor -= SRSCost;
    currentSelfReplicatingSlimeLevel += SRSIncrement;
    SRSCost =  Math.floor(SRSCost * SRSCostInflation)
    
    redrawCosts();
    redrawCursor();
    recalculateAvailableUpgrades();
}

function upgradeMoveReaction(){
    log.debug("upgradeMoveReaction");
    if(slimeOnCursor < moveReactionCost){return;}
    slimeOnCursor -= moveReactionCost;
    baseSlimeAdditionPerMove += moveReactionIncrement;
    moveReactionCost =  Math.floor(moveReactionCost * moveReactionCostInflation)
    
    redrawCosts();
    redrawCursor();
    recalculateAvailableUpgrades();
}

// Recaluclate and redraw functions
function recalculateAvailableUpgrades(){
	$("#upgradeDensity")[0].disabled = slimeOnCursor <= densityCost; 
	$("#upgradeSRS")[0].disabled = slimeOnCursor <= SRSCost; 
	$("#upgradeMoveReaction")[0].disabled = slimeOnCursor <= moveReactionCost; 
}

function redrawCosts(){
    $("#densityCost")[0].innerHTML = densityCost + " ml";
    $("#SRSCost")[0].innerHTML = SRSCost + " ml";
    $("#moveReactionCost")[0].innerHTML = moveReactionCost + " ml";
}
function redrawSlimeTotals(){
    $("#slimeVolumeOnCursor")[0].innerHTML = slimeOnCursor + " ml";
    //$("#slimeOnCursorSpan")[0].innerHTML = getGramMeasureOfSignificance(slimeOnCursor);
    //$("#slimeDensity")[0].innerHTML = currentSlimeDensity;
    $("#totalSlimeCollected")[0].innerHTML = totalSlimeCollected + " ml";
}
function redrawCursor(){
    cursorWidth = Math.sqrt(slimeOnCursor/Math.PI);
    $('#cursor').css({
        'width': cursorWidth + 'px',
        'height': cursorWidth + 'px',
        'line-height': cursorWidth + 'px',
        'border-radius': cursorWidth/2 + 'px'
    });
    $('#cursor')[0].innerHTML = getSlimeVolumeStringOnCursor();
}

// Collisions!
function doCollisions(){
	useSlowCollisionAlgorithm();
	//useFastCollisionAlgorithm();
}

function useSlowCollisionAlgorithm(){
	for(index1 in slimeBalls)
	{
		var ball1 = slimeBalls[index1];
		var hypotenuse = Math.sqrt(ball1.volume/Math.PI) + Math.sqrt(slimeOnCursor/Math.PI);
		var collision = Math.pow(cursorPositionX-ball1.positionX,2) + Math.pow(ball1.positionY-cursorPositionY,2) <= Math.pow(hypotenuse, 2);
		if(collision){
			log.info("cursor hit slimeball");
			log.debug(ball1);
			log.debug("cursorPositionX: " + cursorPositionX);
			log.debug("cursorPositionY: " + cursorPositionY);
			log.debug("slimeOnCursor: " + slimeOnCursor);
			cursorHitsSlimeBall(ball1); //TODO Turn this into some sort of funky "connection" that slowly resolves, to make it look more like it's being absorbed.
			
		}	
		for(index2 in slimeBalls)
		{
			if(index1 != index2)
			{
				var ball2 = slimeBalls[index2];
				hypotenuse = Math.sqrt(ball1.volume/Math.PI) + Math.sqrt(ball2.volume/Math.PI);
				
				collision = Math.pow(ball2.positionX-ball1.positionX,2) + Math.pow(ball1.positionY-ball2.positionY,2) <= Math.pow(hypotenuse, 2);
				if(collision){
					mergeSlimeBalls(ball1, ball2); //TODO Turn this into some sort of funky "connection" that slowly resolves, to make it look more like it's being absorbed.
				}
			}			
		}		
	}
}
function cursorHitsSlimeBall(slimeBall){
	// TODO, make it so you can only absorb smaller slimes
	addToSlimeOnCursor(slimeBall.volume);
	removeSlimeBall(slimeBall);
}

function mergeSlimeBalls(slimeBall1, slimeBall2){
	slimeBall1.volume += slimeBall2.volume;
	removeSlimeBall(slimeBall2);
}

function useFastCollisionAlgorithm(){
	// TODO implement
}

// Other Slimeballs
function slimeBallO(id, positionX, positionY, velocityX, velocityY, volume)
{
	this.id = "slimeBall" + id;
	this.positionX = positionX;
	this.positionY = positionY;
	this.velocityX = velocityX;
	this.velocityY = velocityY;
	this.volume = volume;
}

var nextSlimeBallId = 0;
var maxSlimeBalls = 10;
var chanceOfSlimeBallSpawn = 0.1;
var slimeBalls = new Array();
var otherSlimeBallGrowthRate = 1;
var otherSlimeBallMaxMovement = 2;
var otherSlimeBallMovementChangeRate = 1;

function otherSlimeBallsUpdate(){
	//log.info("Other slime balls count = " + slimeBalls.length);
	randomlySpawnSlimeBall();
	growSlimeBalls();
	moveSlimeBalls();
	agitateSlimeBalls();
	redrawSlimeBalls();
}

function growSlimeBalls(){
	for(index in slimeBalls)
	{
		slimeBalls[index].volume += otherSlimeBallGrowthRate;
	}
}

function moveSlimeBalls(){
	for(index in slimeBalls)
	{
		moveSlimeBall(slimeBalls[index]);
	}
}

function agitateSlimeBalls(){
	for(index in slimeBalls)
	{
		agitateSlimeBall(slimeBalls[index]);
	}
}

function redrawSlimeBalls(){
	for(index in slimeBalls)
	{
		drawSlimeBall(slimeBalls[index]);
	}
}

function agitateSlimeBall(slimeBall)
{
	slimeBall.velocityX += Math.floor(Math.random() * 3)-1;//(2 * otherSlimeBallMovementChangeRate + 1) - otherSlimeBallMovementChangeRate;
	slimeBall.velocityY += Math.floor(Math.random() * 3)-1;// (2 * otherSlimeBallMovementChangeRate + 1) - otherSlimeBallMovementChangeRate;
	//slimeBall.velocityX = Math.min
	//TODO limit velocity
}

function moveSlimeBall(slimeBall)
{
	slimeBall.positionX += slimeBall.velocityX;
	slimeBall.positionY += slimeBall.velocityY;
	if(
		slimeBall.positionX < 0 ||
		slimeBall.positionX > gameViewWidth() ||
		slimeBall.positionY < 0 ||
		slimeBall.positionY > gameViewHeight())
		{
		removeSlimeBall(slimeBall);
	}
}

function removeSlimeBall(slimeBall){
	//log.debug("removing slimeBall " + slimeBall.id);
	var element = document.getElementById(slimeBall.id);
	element.parentNode.removeChild(element);
	for(index in slimeBalls){
		if(slimeBalls[index].id == slimeBall.id){
			slimeBalls.splice(index, 1);
			return;
		}
	}
}

function randomlySpawnSlimeBall(){
	// currentNumberOfSlimeBalls (from 0-maxSlimeBalls)
	var slimeBallSaturation = slimeBalls.length / maxSlimeBalls;
	var adjustedChance = (1-slimeBallSaturation) * chanceOfSlimeBallSpawn
	if(Math.random() < adjustedChance){
		createSlimeBall();
	}
}	
function createSlimeBall(){
	var positionX = Math.floor(Math.random() * gameViewWidth());
	var positionY = Math.floor(Math.random() * gameViewHeight());
	// TODO MAYBE make sure it's not near another slime ball.
	var newSlimeBall = new slimeBallO(nextSlimeBallId, positionX, positionY, 0, 0, 1);
	slimeBalls.push(newSlimeBall);
	nextSlimeBallId += 1;
}

function drawSlimeBall(slimeBall){
	
	if($('#' + slimeBall.id).length == 0){
		var div = document.createElement("div");
		div.className += 'slime';
		div.id = slimeBall.id;
		document.body.appendChild(div);		
	}

    var radius = Math.sqrt(slimeBall.volume/Math.PI);

    $('#' + slimeBall.id).css({
        'position': 'fixed',
            'top': slimeBall.positionY - (radius/2) + 'px',
            'left': slimeBall.positionX - (radius/2) + 'px',
        	'border-radius': radius/2 + 'px',
            'width': radius,
            'height': radius,
            'z-index': -500
    });
}

// Cursor functions
function addSelfReplicatingSlime(){
	//log.debug("addSelfReplicatingSlime");
	addToSlimeOnCursor(Math.floor(currentSelfReplicatingSlimeLevel / currentSlimeDensity));
}

function addToSlimeOnCursor(additionalSlime){
	//log.debug("addToSlimeOnCursor");
	slimeOnCursor += additionalSlime;
	totalSlimeCollected += additionalSlime;
	recalculateAvailableUpgrades();  
	redrawCursor();
	redrawSlimeTotals();  	
}
	
function doCursorMove(){
	//log.debug("doCursorMove");
	addSlimeOnCursorMove();
}

function addSlimeOnCursorMove(){ 
	//log.debug("addSlimeOnCursorMove");   
	var additionalSlime = baseSlimeAdditionPerMove * baseSlimeMultiplierPerMove;
	addToSlimeOnCursor(additionalSlime);
}

function getSlimeMassOnCursor(){
	return currentSlimeDensity * slimeOnCursor;
}

function getSlimeVolumeStringOnCursor(){
	//log.debug("getSlimeMassOnCursor");
	return getLitreMeasureOfSignificance(slimeOnCursor);
}



// Timer functions
// TODO fix timing so that it adjusts itself based on how fast the javascript is running
var lastTick = Date();
var timerInterval = 50;
var stopTimer = false;

function startTimer(){
	stopTimer = false;
	window.setInterval("doTimerEvent();",timerInterval);
}
function stopTimer(){
	stopTimer = true;
}
function doTimerEvent()
{
	if(stopTimer){
		return;
	}
	//log.debug("doTimerEvent");
	var startOfTimerEvent = Date();
	
	addSelfReplicatingSlime();
	otherSlimeBallsUpdate();
	doCollisions();
	
	var endOfTimerEvent = Date();
	window.setInterval("doTimerEvent", timerInterval-(endOfTimerEvent-startOfTimerEvent));
}


// Other Functions
function getElement(id)
{
	return document.getElementById(id);
}

function gameViewWidth(){
 return window.innerWidth;
}
function gameViewHeight(){
 return window.innerHeight;
}

function getLitreMeasureOfSignificance(amount){
	var log10ofAmount = Math.floor(log10(amount));
	
	if(log10ofAmount < 3)
	{
		return Math.round(amount) + "millilitres";
	}
	if(log10ofAmount >= 3 && log10ofAmount < 6)
	{
		return Math.round(amount/10)/100 + "litres";
	}
	if(log10ofAmount >= 6 && log10ofAmount < 9)
	{
		return Math.round(amount/10000)/100 + "megalitres";
	}
	if(log10ofAmount >= 9 && log10ofAmount < 12)
	{
		return Math.round(amount/10000000)/100 + "gigalitres";
	}
	if(log10ofAmount >= 12 && log10ofAmount < 15)
	{
		return Math.round(amount/10000000000)/100 + "teralitres";
	}
	if(log10ofAmount >= 15)
	{
		return Math.round(amount/10000000000000)/100 + "petalitres";
	}
}

function getGramMeasureOfSignificance(amount){
	var log10ofAmount = Math.floor(log10(amount));
	
	if(log10ofAmount < 3)
	{
		return Math.round(amount) + "grams";
	}
	if(log10ofAmount >= 3 && log10ofAmount < 6)
	{
		return Math.round(amount/10)/100 + "kilograms";
	}
	if(log10ofAmount >= 6 && log10ofAmount < 9)
	{
		return Math.round(amount/10000)/100 + "megalitres";
	}
	if(log10ofAmount >= 9 && log10ofAmount < 12)
	{
		return Math.round(amount/10000000)/100 + "tonne";
	}
	if(log10ofAmount >= 12 && log10ofAmount < 15)
	{
		return Math.round(amount/10000000000)/100 + "kilotonne";
	}
	if(log10ofAmount >= 15)
	{
		return Math.round(amount/10000000000000)/100 + "megatonne";
	}
}

function log10(val) {
  return Math.log(val) / Math.LN10;
}
