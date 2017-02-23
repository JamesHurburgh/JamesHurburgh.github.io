requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    },
    shim: {
        'responsivevoice': {
            //Once loaded, use the global 'ResponsiveVoice' as the
            //module value.
            exports: 'ResponsiveVoice'
        }
    }
});

// Start the main app logic.
requirejs(['jquery', 'app/common', "store", "app/languageCodes", "app/wordlists"],
    function($, common, store, languageCodes, wordlists) {

        var set;

        chooseNew = function() {
            var previous = $("#spellingWord").val();
            var word = previous;
            while (previous == word) {
                var index = Math.floor(set.wordList.length * Math.random());
                word = set.wordList[index];
            }
            $("#spellingWord").val(word);
            $("#typedWord").val("");
            saySlowly("Spell. " + word);
        };

        sayWord = function() {
            saySlowly($("#spellingWord").val());
        };

        check = function() {
            var correct = $("#spellingWord").val().toLowerCase().trim();
            var answer = $("#typedWord").val().toLowerCase().trim();

            if (correct == answer) {
                say("Correct");
            } else {
                say("Incorrect");
            }
        };

        displayRandom = function() {
            var previous = $("#word").html();
            var word = previous;
            while (previous == word) {
                var index = Math.floor($(".word").length * Math.random());
                word = $(".word")[index].attributes.word.value;
            }
            displayWord(word);
        };

        loadSetFromList = function(setList) {
            store.set("wordSet", setList.setListName);
            $("#setList").empty();
            $("#setListHeader").empty();
            selectedSightWordSetList = setList.sets;

            $("#setListHeader").append(setList.setListName);

            for (var i = 0; i < selectedSightWordSetList.length; i++) {
                $("#setList").append("<div class='set nav nav-pill' style='border: 2px solid #" + selectedSightWordSetList[i].colorHex + "; border-radius: 5px;' collectionIndex='" + i + "' id='" + selectedSightWordSetList[i].setName + "_set'>" + selectedSightWordSetList[i].setName + "</div>");
                $("#" + selectedSightWordSetList[i].setName + "_set").on("click", function() {
                    loadWordList(this.attributes.collectionindex.value);
                });
            }
        };

        loadWordList = function(index) {
            set = selectedSightWordSetList[index];
            $("#wordContainer").css("border-radius", "10px");
            $("#wordContainer").css("border", "4px solid white");
            $("#wordContainer").css("border", "4px solid #" + set.colorHex);
        };

        initialise = function() {

            initialiseVoice();
            initialiseWordLists();

            $("#pickRandomWordButton").click(function() { chooseNew(); });
            $("#sayWordButton").click(function() { sayWord(); });
            $("#check").click(function() { check(); });
        };

        initialise();
    });