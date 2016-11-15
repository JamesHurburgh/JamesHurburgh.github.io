$(document).ready(function() {

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function chooseRandom(list) {
        return list[randBetween(0, list.length)];
    }

    function loadPlaceMark(script) {
        $("#placeMark").val(script);
    }

    function readTextFile(file) {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    var allText = rawFile.responseText;
                    alert(allText);
                }
            }
        }
        rawFile.send(null);
    }

    function transform() {
        var output = $("#placeMark").val();

        var tablesRegex = new RegExp(/{{([^{}]*?::[^{}]*?)}}/);
        var tableMatch;
        if (tableMatch = tablesRegex.exec(output)) {
            alert("Table Match:" + tableMatch);
            var name = tableMatch[1].split("::")[0];
            var list = tableMatch[1].split("::")[1];

            alert("TableName:" + name);
            alert("List:" + list);


        }


        //var placeMark = new RegExp(/{{(.|\n)*?)}}/);
        var placeMark = new RegExp(/{{([^{}]*?)}}/);
        var match;
        while (match = placeMark.exec(output)) {
            var fullText = match[0];
            var innerText = match[1];
            var list = innerText.split("|");
            var choice = chooseRandom(list);

            output = output.replace(fullText, choice);
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
});