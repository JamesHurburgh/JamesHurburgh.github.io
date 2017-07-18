define(['jquery', 'store', 'app/dicer'],
    function($, store, dicer) {

        var tablesRegex = new RegExp(/{{((?:.|\n)+?)(?!({{(?:.|\n)+?}}))}}/);
        return {
            //    var tablesRegex = new RegExp(/{{{([^{}]*?:::[^{}]*?)}}}/);
            setScriptList: function(scriptList) {
                this.scriptList = scriptList;
            },

            getScript: function(reference, scriptDao) {
                // TODO break down into namespace etc.
                var scripts = this.scriptList;
                for (var i = 0; i < scripts.length; i++) {
                    if (reference === scripts[i].title) {
                        return scripts[i].script;
                    }
                }
                return "[[ERR: No import found for '" + reference + "']]";
            },

            /* What a table definition shold look like

            {{size[2d4]::
                [2]Diminuative|
                [3]Tiny|
                [4]Small|
                [5]Medium|
                [6]Large|
                [7]Huge|
                [8]Collosus}}

            {{hitLocation[d10]::
                [1-6]{:miss}|
                [7]Torso|
                [8]Arms|
                [9]Legs|
                [10]Head}}

            */

            rollOnTable: function(table) {
                var rollDictionary = table.rollDictionary;
                var roll = dicer.parseRollString(table.roll);
                for (var i = 0; i < rollDictionary.length; i++) {
                    if (rollDictionary[i].min <= roll && rollDictionary[i].max >= roll) {
                        return rollDictionary[i].item;
                    }
                }
                return "[ERR: " + roll + " did not appear in lookup " + table.title + ".]";
            },

            parseTables: function(input) {
                var tables = [];

                var tableMatch;
                while (tableMatch = tablesRegex.exec(input)) {
                    var table = this.parseSingleTable(tableMatch[1]);
                    tables[table.name] = table;
                    input = input.replace(tableMatch[0], "");
                }
                return tables;
            },

            parseSingleTable: function(tableDefinitionString) {
                var tableDef = tableDefinitionString.split("::");
                var header = tableDef[0];
                var name = header.split(":")[0]; // TODO change format to: tableName[roll] instead of tableName:roll
                var roll = header.split(":")[1];
                if (!tableDef[1]) {
                    // TODO throw an error.
                    //Console.log("Invalid table definition: " + tableMatch[1])
                    return;
                }
                var list = tableDef[1].split("|");
                var rollDictionary = [];
                if (!roll) {
                    roll = "d" + list.length;
                }
                var minRoll = dicer.getMinRoll(roll);
                var maxRoll = dicer.getMaxRoll(roll);
                for (var i = 0; i < list.length; i++) {
                    var rollDef = list[i];
                    var rollDefRegex = new RegExp(/(?:\[(\d+(?:-\d+)?)\])?(.+)/);
                    rollDefMatch = rollDefRegex.exec(rollDef);
                    if (!rollDef) {
                        var min = i + minRoll; // This doesn't account for mixed mode.  It assumes if autonumbering occurs, it occurs for all.
                        var max = i + minRoll;
                        rollDictionary.push({ item: "", min: min, max: max });
                    } else
                    if (!rollDefMatch[1]) { //Then there is no numbering.  Use autonumbering.
                        var min = i + minRoll; // This doesn't account for mixed mode.  It assumes if autonumbering occurs, it occurs for all.
                        var max = i + minRoll;
                        rollDictionary.push({ item: rollDefMatch[2], min: min, max: max });
                    } else {
                        var min = rollDefMatch[1].split("-")[0];
                        var max = rollDefMatch[1].split("-")[1];
                        if (!max) { max = min; }
                        rollDictionary.push({ item: rollDefMatch[2], min: min, max: max });
                    }
                }
                return {
                    name: name,
                    roll: roll,
                    list: list,
                    minRoll: dicer.getMinRoll(roll),
                    maxRoll: dicer.getMaxRoll(roll),
                    rollDictionary: rollDictionary
                };
            },

            removeTables: function(input) {
                var tableMatch;
                while (tableMatch = tablesRegex.exec(input)) {
                    input = input.replace(tableMatch[0], "");
                }
                return input;
            },

            parse: function(output) {

                var tables = this.parseTables(output);
                output = this.removeTables(output);
                var unnamedTables = [];
                var variables = {};

                var placeMarkRegex = new RegExp(/{([^{}]*?)}/);
                var placeMarkMatch;
                while (placeMarkMatch = placeMarkRegex.exec(output)) {
                    var choice;
                    var fullMatch = placeMarkMatch[0];
                    var innerText = placeMarkMatch[1];

                    // var colonIndex = innerText.indexOf(":");
                    // if(colonIndex == -1){
                    //     var list = innerText.split("|");
                    //     if (list.constructor != Array) {
                    //         list = [list]; // If the array only has one item it will be treated as a char array, instead of an array of one string.
                    //         unnamedTables.push(list);
                    //     }
                    //     choice = chooseRandom(list);
                    // }else{
                    //     var functionName = innerText.substring(0, colonIndex);
                    //     var text = innerText.substring(colonIndex+1, innerText.length);
                    //     var functionNameRegExp = new RegExp(/(.+)(?:\[(.*?)\])?/);
                    //     var functionNameMatch = functionNameRegExp.exec(functionName);
                    //     functionName = functionNameMatch[1];
                    //     var functionParameters = functionNameMatch[2];
                    //     console.log("Function Called: '" + functionName + "[" + functionParameters + "]" + text + "'");
                    // }
                    var functionCall = innerText.split(":");
                    if (functionCall == innerText) {
                        var list = innerText.split("|");
                        if (list.constructor != Array) {
                            list = [list]; // If the array only has one item it will be treated as a char array, instead of an array of one string.
                            unnamedTables.push(list);
                        }
                        choice = dicer.chooseRandom(list);
                    } else {
                        var functionWithParamsRegex = new RegExp(/(.+?)\[((?:.|[\n\r])+?)\]/g);
                        var functionWithParamsMatch = functionWithParamsRegex.exec(functionCall[0]);
                        var functionName = functionCall[0];
                        var parameters = [];
                        if (functionWithParamsMatch) {
                            functionName = functionWithParamsMatch[1];
                            parameters = functionWithParamsMatch[2].split(",");
                        }
                        switch (functionName) {
                            case "":
                            case "lookup":
                                var table = tables[functionCall[1]];
                                if (!table) {
                                    choice = "[[ERR: No table definition found for '" + functionCall[1] + "']]"
                                } else {
                                    choice = this.rollOnTable(table);
                                }
                                break;
                            case "%":
                            case "range":
                                choice = dicer.randBetween(Number(functionCall[1].split("-")[0]), Number(functionCall[1].split("-")[1]));
                                break;
                            case "r":
                            case "roll":
                                choice = dicer.parseRollString(functionCall[1]);
                                break;
                            case "shuffle":
                                var seperator = ", ";
                                if (parameters[0]) {
                                    seperator = parameters[0];
                                }
                                var list = functionCall[1].split("|");
                                choice = dicer.shuffle(list).join(seperator);
                                break;
                            case "&":
                            case "repeat":
                                var text = functionCall[1];
                                choice = "";
                                for (var i = 0; i < parameters[0]; i++) {
                                    choice += text;
                                }
                                break;
                            case "set":
                                variables[functionCall[1].split("=")[0]] = functionCall[1].split("=")[1];
                                choice = "";
                                break;
                            case "get":
                                choice = variables[functionCall[1]];
                                break;
                            case "var":
                                var value = functionCall[1].split("=")[1];
                                if (functionCall[1].indexOf("=") == -1) {
                                    choice = variables[functionCall[1]];
                                } else {
                                    variables[functionCall[1].split("=")[0]] = functionCall[1].split("=")[1];
                                    choice = "";
                                }
                                break;
                            case "!":
                            case "import": // Usage {import:AnotherPlacemark} or {!:AnotherPlacemark} will look up that other placemark, parse it and add the results here.
                                var scriptImport = this.getScript(functionCall[1], function() { return store.get('scriptList'); });
                                var importedTables = this.parseTables(scriptImport);
                                for (var key in importedTables) {
                                    tables[key] = importedTables[key];
                                }
                                // displayTables(tables); // TODO Work out how to show imported tables
                                choice = this.parse(scriptImport);
                                break;
                            case "eval":
                                // TODO Strip non maths symbols.
                                choice = eval(functionCall[1]);
                                break;
                            case "#":
                            case "comment":
                                choice = "";
                                break;
                            case "test":
                                choice = "(Test output:";
                                for (var i = 0; i < parameters.length; i++) {
                                    choice += "parameter[" + i + "]:" + parameters[i] + ":";
                                }
                                choice += functionCall[1] + ")";
                                break;
                        }
                    }

                    output = output.replace(fullMatch, choice);
                }

                return output;

            }

        }
    });