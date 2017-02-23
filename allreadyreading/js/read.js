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

        workingList = [];

        sayWord = function() {
            sayThisWord($("#word").html());
        };

        loadSetFromList = function(setList) {
            store.set("wordSet", setList.setListName);
            clearWord();
            $("#wordList").empty();
            $("#setList").empty();
            $("#setListHeader").empty();
            $("#wordListHeader").empty();
            selectedSightWordSetList = setList.sets;

            $("#setListHeader").append(setList.setListName);
            $("#wordListHeader").append("-");

            for (var i = 0; i < selectedSightWordSetList.length; i++) {
                $("#setList").append("<div class='set nav nav-pill' style='border: 2px solid #" + selectedSightWordSetList[i].colorHex + "; border-radius: 5px;' collectionIndex='" + i + "' id='" + selectedSightWordSetList[i].setName + "_set'>" + selectedSightWordSetList[i].setName + "</div>");
                $("#" + selectedSightWordSetList[i].setName + "_set").on("click", function() {
                    loadWordList(this.attributes.collectionindex.value);
                });
            }
        };

        loadWordList = function(index) {
            var set = selectedSightWordSetList[index];
            clearWord();
            $("#wordList").empty();
            $("#wordListHeader").empty();
            $("#wordContainer").css("border-radius", "10px");
            $("#wordContainer").css("border", "4px solid white");
            $("#wordContainer").css("border", "4px solid #" + set.colorHex);
            $("#wordListHeader").append(set.setName);
            for (var i = 0; i < set.wordList.length; i++) {
                $("#wordList").append("<div id='" + set.wordList[i] + "' class='word' word='" + set.wordList[i] + "'>" + set.wordList[i] + "</div>");
            }
            $(".word").click(function() { sayThisWord(id); });
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

        displayWord = function(word) {
            $("#word").empty();
            $("#word").append(word);
        };

        clearWord = function() {
            $("#word").empty();
            $("#word").append("-");
        };

        initialise = function() {

            initialiseVoice();
            initialiseWordLists();

            $("#pickRandomWordButton").click(function() { displayRandom(); });
            $("#sayWordButton").click(function() { sayWord(); });
            $("#word").click(function() { sayWord(); });
        };

        initialise();

    });