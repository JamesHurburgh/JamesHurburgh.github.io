$(document).ready(function() {

    function randBetween(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    function chooseRandom(list) {
        return list[randBetween(0, list.length)];
    }

    function transform() {
        var output = $("#placeMark").val();

        var tablesRegex = new RegExp(/{{{(.*?:(.|\n)*?)}}}/);
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