    var tablesRegex = new RegExp(/{{{((?:.|\n)+?)(?!({{{(?:.|\n)+?}}}))}}}/);
    //    var tablesRegex = new RegExp(/{{{([^{}]*?:::[^{}]*?)}}}/);

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function chooseRandom(list) {
        return list[randBetween(0, list.length)];
    }

    function shuffle(array) {
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
    }

    function importScript(reference, scriptDao){
        // TODO break down into namespace etc.
        var scripts = scriptDao();
        for(var i = 0; i < scripts.length; i++){
            if(reference === scripts[i].title){
                return parse(scripts[i].script);
            }
        }
        return "[[ERR: No import found for '" + reference + "']]";
    }

    /* What a table definition shold look like

    {{size:2d4::
        2:Diminuative|
        3:Tiny|
        4:Small|
        5:Medium|
        6:Large|
        7:Huge|
        8:Collosus}}

    {{hitLocation:d10::
        1-6:Miss|
        7:Torso|
        8:Arms|
        9:Legs|
        10:Head}}

    */

    function rollOnTable(table) {
        return chooseRandom(table.list);
    }

    function parseTables(input) {
        var tables = [];

        var tableMatch;
        while (tableMatch = tablesRegex.exec(input)) {
            var tableDef = tableMatch[1].split(":::");
            var header = tableDef[0];
            var name = header.split(":")[0];
            var roll = header.split(":")[1];
            var list = tableDef[1].split("|");
            if (!roll) {
                roll = "d" + list.length;
            }
            tables[name] = { roll: roll, list: list };
            input = input.replace(tableMatch[0], "");
        }
        return tables;
    }

    function removeTables(input) {
        var tableMatch;
        while (tableMatch = tablesRegex.exec(input)) {
            input = input.replace(tableMatch[0], "");
        }
        return input;
    }

    function parseRollString(rollString) {
        // So far handles things like 2d4 + 3d8 + 10
        // TODO Add rerolls, add function to count successes
        var allRolls = rollString.split("+");
        var total = 0;
        for (var i = 0; i < allRolls.length; i++) {
            total += parseSingleRoll(allRolls[i]);
        }
        return total
    }

    function parseSingleRoll(singleRollString) {
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
        return roll(iterations, dieValue);

    }

    function roll(iterations, dieValue) {
        var total = 0;
        for (var i = 0; i < iterations; i++) {
            total += randBetween(1, dieValue);
        }
        return total;
    }

    function parse(output) {

        var tables = parseTables(output);
        output = removeTables(output);
        var unnamedTables = [];
        var variables = {};

        var placeMarkRegex = new RegExp(/{{([^{}]*?)}}/);
        var placeMarkMatch;
        while (placeMarkMatch = placeMarkRegex.exec(output)) {
            var choice;
            var fullMatch = placeMarkMatch[0];
            var innerText = placeMarkMatch[1];
            var functionCall = innerText.split("::");
            if (functionCall == innerText) {
                var list = innerText.split("|");
                if (list.constructor != Array) {
                    list = [list]; // If the array only has one item it will be treated as a char array, instead of an array of one string.
                    unnamedTables.push(list);
                }
                choice = chooseRandom(list);
            } else {
                switch (functionCall[0]) {
                    case "":
                    case "lookup":
                        var table = tables[functionCall[1]];
                        if (!table) {
                            choice = "[[ERR: No table definition found for '" + functionCall[1] + "']]"
                        } else {
                            choice = rollOnTable(table);
                        }
                        break;
                    case "range":
                        choice = randBetween(Number(functionCall[1].split("-")[0]), Number(functionCall[1].split("-")[1]));
                        break;
                    case "roll":
                        choice = parseRollString(functionCall[1]);
                        break;
                    case "shuffle":
                        // TODO allow for custom seperator
                        var list = functionCall[1].split("|");
                        var seperator = ", ";
                        choice = shuffle(list).join(seperator);
                        break;
                    case "repeat":
                        var parameter = functionCall[1];
                        var text = functionCall[2];
                        choice = "";
                        for (var i = 0; i < parameter; i++) {
                            choice += text;
                        }
                        break;
                    case "set":
                        variables[functionCall[1]] = functionCall[2];
                        choice = "";
                        break;
                    case "get":
                        choice = variables[functionCall[1]];
                        break;
                    case "import":
                        choice = importScript(functionCall[1], function(){return store.get('scriptList')});
                        break;
                    case "eval":
                    // TODO Strip non maths symbols.
                        choice = eval(functionCall[1]);
                        break;
                    case "comment":
                        choice = "";
                        break;
                }
            }

            output = output.replace(fullMatch, choice);
        }

        return output;

    }