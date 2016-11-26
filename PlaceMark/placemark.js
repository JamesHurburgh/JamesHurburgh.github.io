$(document).ready(function() {

    function loadScriptList() {
        $("#scriptList").html("Loading scriptList...");
        var scriptList = store.get('scriptList');
        if (!scriptList) {
            getDocumentation();
            scriptList = store.get('scriptList');
        }
        $("#scriptList").html("");
        scriptList.forEach(function(element) {
            var link = $("<a href='#' class='list-group-item'></a>");
            link.append(element.title);
            link.attr("href", "#" + element.title);
            $("#scriptList").append(link);
        }, this);
    }

    function exportScript() {
        var script = { value: $("#placeMark").val() };
        alertify.alert(JSON.stringify($("#placeMark").val()));

    }

    function loadScript() {
        var titleToLoad = window.location.hash.substr(1);
        console.log("Loading " + window.location.hash.substr(1));
        var scriptList = store.get('scriptList');
        for (var i = 0; i < scriptList.length; i++) {
            if (scriptList[i].title === titleToLoad) {
                $("#title").val(scriptList[i].title);
                $("#placeMark").val(scriptList[i].script);
                transform();
            }
        }
    }

    function deleteScript() {

        var title = $("#title").val();
        if (confirm("Are you sure you want to delete '" + title + "' forever?")) {
            deleteScript(title);
        };
    }

    function deleteScript(scriptName) {
        var scriptList = store.get('scriptList');
        for (var i = 0; i < scriptList.length; i++) {
            if (scriptList[i].title === title) {
                scriptList.splice(i, 1);
            }
        }
        store.set('scriptList', scriptList);
        loadScriptList();
    }

    function saveScript() {

        var scriptList = store.get('scriptList');

        var title = $("#title").val();
        var script = $("#placeMark").val();

        var index = -1;
        for (var i = 0; i < scriptList.length; i++) {
            if (scriptList[i].title === title) {
                index = i;
            }
        }

        if (index === -1) {
            scriptList.push({ "title": title, "script": script });
        } else {
            if (confirm("Overwrite " + title + "?")) {
                scriptList[index].script = script;
            }
        }

        store.set('scriptList', scriptList);
        loadScriptList();
    }

    function reloadDocumentation() {
        var scriptList = store.get('scriptList');
        if (!scriptList) {
            scriptList = [];
        }
        var documentation = getDocumentation();
        for (var i = 0; i < documentation.length; i++) {
            var documentationFound = false;
            for (var j = 0; j < scriptList.length; j++) {
                if (scriptList[i].title === documentation[i].title) {
                    scriptList[i].script === documentation[i].script;
                    documentationFound = true;
                }
            }
            if (!documentationFound) {
                scriptList.push(documentation[i]);
            }
        }
        store.set('scriptList', scriptList);
    }

    function getDocumentation() {
        var scriptList = [];
        scriptList.push({ "title": "1 - Introduction", "script": "#Introduction\n\nThis {{awesome|fantastic|terrific|splendiferous}} {{website|webpage|online tool|magic portal}} {{helps|assists|just gets stuff done}} {{creating|making|assembling}} {{random|natural|funky}} {{output|text|sentences|works of art}}.\n\nThis is done by transforming PlaceMark script, which is {{what you see|}} in the text area above. It allows you to write natural sentences with placeamrks where you would like to include random words. This is done by using double curly braces {{placeholder}} with a list of possible {{words or phrases|phrases or words}} to use seperated by the bar \"|\" character. When the text is transformed a random option will be chosen from each PlaceMark. It's that simple!\n\nThe {{magic internet navigation buttons|links}} {{on the right|on the starboard side of your browser|over there -->}} (once they exist) will be all of your available PlaceMark Scripts. Right now I've (got the intention to) put a bunch of helpful tutorials that will help you familiarise yourself with the interface and get you started making your own fantastic PlaceMark Scripts.\n\nThe {{results are|output is}} {{parsed|transformed}} as [Markdown](https://en.wikipedia.org/wiki/Markdown) {{for your convinience|so you don't have to}}." });
        scriptList.push({ "title": "2 - Getting started", "script": "# Getting started\n\nGetting started is easy. Simply fill in a sentence, then choose a word that you want to be able to randomise. For example: \n*As you step out into the street a cold breeze blows by.*\n\nPerhaps it's not a street, it's a road, or alley. First thing you need to do is wrap your word in double curly braces like this: {{street}}. Then hit the Transform button. \n*As you step out into the {{street}} a cold breeze blows by.*\n\nYou'll notice that the curly braces are gone, but not much else has changed. It's replaced the curly braces with a selection of what's inside the curly braces, but since it only has one option to choose from that's all you'll ever get. Now add some options to your list like so: \n{{street|road|alley|cul-de-sac|paved area|bustling metropolis}} \n*As you step out into the {{street|road|alley|cul-de-sac|paved area|bustling metropolis}} a cold breeze blows by.*\n\nNow when you hit the Transform button a few times, you'll notice that the output has changed each time with a random result.\n\nCongratulations! You've made your first PlaceMark script." });
        scriptList.push({ "title": "3 - Tables", "script": "# {{Tables|Lists}}\n* Define tables to look up seperately then reference them so you don't have a massive list in your text all the time. It looks like this:\nThe shadowy figure disappeared to the {{::cardinalpoint}} becomes:\n*The shadowy figure disappeared to the {{::cardinalpoint}}*\n\nWhen the table is defined like this: \n{{{cardinalpoint::: \nNorth| \nSouth| \nEast| \nWest}}}\n\n{{{cardinalpoint:::\nNorth|\nSouth|\nEast|\nWest}}}" });
        scriptList.push({ "title": "4 - Nesting", "script": "#{{Nesting|Putting PlaceMarks in other PlaceMarks}}\nPlaceMarks can be nested inside another PlaceMark. For example you might want to describe a piece of clothing, so you might want to say it's a coat or hat. Then you might want to say it's a floppy hat or a long coat. So you would do the following:\n\n*The figure is wearing a {{{{floppy |broad |}}hat|{{long |short |}}coat}} and seems to be nervous about something.*" });
        scriptList.push({ "title": "5 - Functions", "script": "# Functions\n## Ranges\nInstead of picking from lists, you can also easily pick a random number. \nTry {{range::1-100}} to get a results like this: {{range::1-100}}, {{range::1-100}}, {{range::1-100}}\n## Evaluations\nIf you'd like to do maths in your script, that's no problem. Use {{eval::1+1}} and anything in the braces will get evaluated using javascript's evaluation processes.\n## Comments\nComments are treated like functions in PlaceMark script, to make sure they are removed consistently from the output. Simple use the following syntax to put a comment in your script: \n{{comment::This example comment will appear in the output so you can see the syntax.}}\n{{comment::This real comment will not appear in the output.}}\n\n# Everybody's Shuffling\nUse shuffle when you want to list all the elements in the list, but in a random order.\n\n{{shuffle::1|2|3|4}} \n\nWhy not shuffle a deck of cards?\n\n{{shuffle::A♠|2♠|3♠|4♠|5♠|6♠|7♠|8♠|9♠|10♠|J♠|Q♠|K♠|A♥|2♥|3♥|4♥|5♥|6♥|7♥|8♥|9♥|10♥|J♥|Q♥|K♥|A♦|2♦|3♦|4♦|5♦|6♦|7♦|8♦|9♦|10♦|J♦|Q♦|K♦|A♣|2♣|3♣|4♣|5♣|6♣|7♣|8♣|9♣|10♣|J♣|Q♣|K♣}}" });
        scriptList.push({ "title": "6 - Planned Features", "script": "# {{Planned Features|Stuff I want to add|Things that I think would be {{fun|cool|useful|not terrible|ground breaking|profitable|are so awesome they would unravel the very fabric of the space time continuum, and destroy the entire universe! Granted, that's a worse case scenario. The destruction might in fact be very localized, limited to merely our own galaxy.}}}}\n\n## Aliases\n* An alias is easy to define. If you want to use compasspoint as a table/list name instead of cardinal just call the table from the table like so:\n{{{compasspoint:::{{::cardinalpoint}}}}}\n\n## Versioning\n* Because if you save over your script but didn't mean to, I don't want you to lose the stuff you made.\n\n## {{Functions|Methods|Not just lists}}\n* Things like maths evaluations {{}}\n* Number ranges eg. {{range:::1-10}}\n* This leads to being able to do things like {{roll:::3d10}}\n\n## Imports\n* So you've made a PlaceMark Script that describes a commoner nicely. But now you want to create a random encounter that includes a commoner. Instead of redoing all your hard work, you want to just be able to go {{import::commoner}} don't you? Yes you do, because that would be awesome. I'll get right onto that after I've made saving and loading a thing.\n\n## {{Collaboration|Working with your {{friends|enemies|cohorts|group|buddies|crew}}|{{Using|Stealing|Borrowing}} other peoples stuff}}\n* Right now this is just hosted on a single page on github. If enough peope are interested I'll put it on it's own server and give people user accounts. Then we can:\n** Share our Scripts\n** Import other peoples scripts into your scripts (see above)\n** Favourite other peoples scripts\n** Vote on scripts\n** Comment on scripts\n** Categorise scripts to make them easier to find. " });
        scriptList.push({ "title": "Advanced: Making Images with SVG", "script": "#Making Images with SVG\nComing soon!" });
        scriptList.push({ "title": "Example - The Tavern Special", "script": "# The Tavern Special\nThe {{::price}} tavern special tonight is {{::size}} portions of {{::cookingStyle}} {{::meatType}} served with {{::sideDish}}.\nThe ingredients taste {{::quality}} though overall the meal is {{::cookingQuality}}.\n\n{{{cookingQuality:::undercooked|overcooked|burnt|too salty|too bland|too dry|too moist|just right}}}\n{{{price:::cheap|fairly priced|costly|very expensive}}}\n{{{size:::miniscule|tiny|small|normal|big|large|huge|enormous}}}\n{{{quality:::horrible|pitiful|poor|sub-standard|decent|good|quality|excellent}}}\n{{{cookingStyle:::boiled|broiled|grilled|roasted|fried|stewed}}}\n{{{sideDish:::vegetables|a salad|bread|beer|fruit|nuts|cheese|eggs}}}\n\n{{{meatType:::Alligator\n| Alpaca\n| Bear\n| Beaver\n| Beef\n| Bison\n| Buffalo\n| Camel\n| Cat\n| Chicken\n| Cougar\n| Crayfish\n| Crocodile\n| Deer\n| Dog\n| Donkey\n| Duck\n| Elk\n| Fish\n| Goose\n| Horse\n| Lamb\n| Llama\n| Lobster\n| Moose\n| Mussels\n| Mutton\n| Oysters\n| Partridge\n| Pheasant\n| Pork\n| Possum\n| Prawn\n| Quail\n| Rabbit\n| Rat\n| Red fox\n| Reindeer\n| Shrimp\n| Snake\n| Sweetbreads\n| Tripe\n| Turkey\n| Turtle\n| Veal\n| Venison\n| Wild bull\n| Wild goat\n| Wild pig\n| Mystery meat}}}" });
        return scriptList;
    }

    function loadPlaceMark(script) {
        $("#placeMark").val(script);
    }

    function displayTables(tables) {
        var tableDiv = $("#tables");
        var keys = Object.keys(tables);
        keys.forEach(function(element) {
            var table = tables[element];
            tableDiv.append($("<table>").append($("<tr>").append($("<th>").append(element))));
        }, this);
    }

    function transform() {

        var output = $("#placeMark").val();
        tables = parseTables(output);
        displayTables(tables);
        result = parse(output);

        $("#markdown").val(result);
        converter = new showdown.Converter(),
            html = converter.makeHtml(result);
        $("#output").html(html);


    }

    // Event Handlers
    $("#transform").click(function() {
        transform();
    });
    Mousetrap.bind('ctrl+t', function(e) {
        transform();
        return false;
    });

    $("#delete").click(function() {
        deleteScript()
    });
    $("#reloadDocumentation").click(function() {
        reloadDocumentation()
    });
    $("#export").click(function() {
        exportScript()
    });
    $("#save").click(function() {
        saveScript();
        transform();
    });
    $(window).on('hashchange', function() {
        loadScript();
    });

    // Initialise    
    transform();
    loadScriptList();
});