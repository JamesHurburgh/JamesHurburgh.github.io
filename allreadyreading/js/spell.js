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
        var incorrectCounter = 0;
        var timer = null;

        chooseNew = function() {
            clearInterval(timer);
            var previous = $("#spellingWord").val();
            var word = previous;
            incorrectCounter = 0;

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
            var answer = $("#spellingWord").val().toLowerCase().trim();
            var givenAnswer = $("#typedWord").val().toLowerCase().trim();

            if (givenAnswer == answer) {
                correctAnswer(answer);
                autoNext();
            } else {
                incorrectAnswer(answer);
            }
        };

        correctAnswer = function(word) {
            correct();
            updateProfileStatistic(word, "Spell", true);
        };

        incorrectAnswer = function(word) {
            handleIncorrect();
            updateProfileStatistic(word, "Spell", false);
        };

        handleIncorrect = function() {
            incorrectCounter = incorrectCounter + 1;
            if (incorrectCounter >= 3) {
                var word = $("#spellingWord").val();
                var message = "Incorrect.  Listen.  " + (word.split("").join(". "));
                say(message);
            } else {
                say("Incorrect.  Try again.");
            }
        };

        autoNext = function() {
            clearInterval(timer);
            timer = setInterval(chooseNew, 3000);
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
            $("#overlay").addClass("hidden");
        };

        initialise = function() {

            initialiseVoice();
            initialiseWordLists();

            $("#pickRandomWordButton").click(function() { chooseNew(); });
            $("#sayWordButton").click(function() { sayWord(); });
            $("#check").click(function() { check(); });

            $(document).on('keypress', '#typedWord', function(e) {
                if (e.keyCode == 13) { // enter key
                    check();
                }
            });
        };

        initialise();
    });