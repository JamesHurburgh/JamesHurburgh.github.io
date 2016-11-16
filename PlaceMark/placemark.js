$(document).ready(function() {

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function chooseRandom(list) {
        return list[randBetween(0, list.length)];
    }

    function loadScriptList() {
        $("#scriptList").html("Loading scriptList...");
        var scriptList = store.get('scriptList');
        if (!scriptList) {
            loadDefaultPlaceMarkScripts();
            scriptList = store.get('scriptList');
        }
        alert(scriptList);
    }

    function loadDefaultPlaceMarkScripts() {
        scriptList = [];
        scriptList["Introduction"] = "# Introduction";
        store.set('scriptList', scriptList);
    }

    function loadPlaceMark(script) {
        $("#placeMark").val(script);
    }

    function transform() {
        var output = $("#placeMark").val();

        var tables = [];

        var tablesRegex = new RegExp(/{{{([^{}]*?:::[^{}]*?)}}}/);
        var tableMatch;
        while (tableMatch = tablesRegex.exec(output)) {
            var tableDef = tableMatch[1].split(":::");
            var name = tableDef[0];
            var list = tableDef[1];

            tables[name] = list.split("|");

            output = output.replace(tableMatch[0], "");
        }

        var placeMarkRegex = new RegExp(/{{([^{}]*?)}}/);
        var placeMarkMatch;
        while (placeMarkMatch = placeMarkRegex.exec(output)) {
            var choice;
            var fullMatch = placeMarkMatch[0];
            var innerText = placeMarkMatch[1];
            var functionCall = innerText.split("::");
            if (functionCall == innerText) {
                var list = innerText.split("|");
                choice = chooseRandom(list);
            } else if (functionCall[0] === "" || functionCall[0] === "table") { // "" because table or list is the default
                // This is a table call
                choice = chooseRandom(tables[functionCall[1]]);
            } else if (functionCall[0] === "range") {
                choice = randBetween(functionCall[1].split("-")[0], functionCall[1].split("-")[1]);
            }

            output = output.replace(fullMatch, choice);
        }

        $("#markdown").val(output);
        converter = new showdown.Converter(),
            html = converter.makeHtml(output);
        $("#output").html(html);

    }

    $("#transform").click(function() {
        transform();
    });

    // Initialise    
    transform();
    loadScriptList();
});