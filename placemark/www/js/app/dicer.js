
define([],
function   dicer() {

    return {

     randBetween : function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    chooseRandom : function(list) {
        return list[this.randBetween(0, list.length-1)];
    },

     shuffle : function(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },
    

    getMinRoll : function(rollString) {
        var allRolls = rollString.split("+");
        var total = 0;
        for (var i = 0; i < allRolls.length; i++) {
            total += this.getMinFromSingleRoll(allRolls[i]);
        }
        return total;
    },

    getMinFromSingleRoll : function(rollString) {
        var dice = Number(rollString.split("d")[0]);
        var dieValue = Number(rollString.split("d")[1]);
        if (!dieValue) { // Then the input is just a number return that
            return dice;
        } else if (rollString[0] === "d") { // If the string starts with 'd' then assume it's 1 die being rolled.
            return 1;
        } else {
            return dice;
        }
    },
    

    /// Handles single numbers: 7, single die rolls (e.g. d10, d20), multiple die rolls (e.g. 3d4, 2d12) and combinations of all of these (e.g. 2d12 + d4 + 10).
    getMaxRoll : function(rollString) {
        var allRolls = rollString.split("+");
        var total = 0;
        for (var i = 0; i < allRolls.length; i++) {
            total += this.getMaxFromSingleRoll(allRolls[i]);
        }
        return total;
    },

    getMaxFromSingleRoll : function(rollString) {
        var dice = Number(rollString.split("d")[0]);
        var dieValue = Number(rollString.split("d")[1]);
        if (!dieValue) { // Then the input is just a number return that
            return dice;
        } else if (rollString[0] === "d") { // If the string starts with 'd' then assume it's 1 die being rolled.
            return dieValue;
        } else {
            return dieValue * dice;
        }
    },

    getRollsFromString : function(rollString) {
        var allRolls = rollString.split("+");

    },

    getRollFromString : function(rollString) {
        var iterations = Number(singleRollString.split("d")[0]);
        var dieValue = Number(singleRollString.split("d")[1]);
        if (!dieValue) { // Then the input is just a number return that
            return iterations;
        }
        if (singleRollString[0] === "d") { // If the string starts with 'd' then assume it's 1 die being rolled.
            iterations = 1;
        }
    },

    parseSingleRoll : function(singleRollString) {
        if (!singleRollString) {
            console.log("parseSingleRoll(singleRollString) received null value.")
            return 0;
        }
        var iterations = Number(singleRollString.split("d")[0]);
        var dieValue = Number(singleRollString.split("d")[1]);
        if (!dieValue) { // Then the input is just a number return that
            return iterations;
        }
        if (singleRollString[0] === "d") { // If the string starts with 'd' then assume it's 1 die being rolled.
            iterations = 1;
        } // Otherwise, roll it out
        return this.roll(iterations, dieValue);

    },
    
    parseRollString : function(rollString) {
        // So far handles things like 2d4 + 3d8 + 10
        // TODO Add rerolls, add function to count successes, fudge dice
        var allRolls = rollString.split("+");
        var total = 0;
        for (var i = 0; i < allRolls.length; i++) {
            total += this.parseSingleRoll(allRolls[i]);
        }
        return total
    },  


    roll : function(iterations, dieValue) {
        var total = 0;
        for (var i = 0; i < iterations; i++) {
            total += this.randBetween(1, dieValue);
        }
        return total;
    },
}});