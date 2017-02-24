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
            var previous = $("#correctWord").val();
            $("#wordFindContainer").empty();

            // Select word
            var word = previous;
            while (previous == word) {
                var index = Math.floor(set.wordList.length * Math.random());
                word = set.wordList[index];
            }
            $("#correctWord").val(word);

            // Add buttons
            var numberOfOptions = Math.min(5, set.wordList.length);
            var randomIndex = Math.floor(numberOfOptions * Math.random());
            var options = [word];
            var wordButton = $("<button type='button' class='btn btn-primary btn-lg correct'></button>").append(word);
            
            for(var i = 0; i < numberOfOptions; i ++){

                if(i == randomIndex){
                    $("#wordFindContainer").append(wordButton);
                }else{
                    var newWord = word;
                    while($.inArray(newWord,options) != -1){
                        var j = Math.floor(set.wordList.length * Math.random());
                        newWord = set.wordList[j];
                    }
                    options.push(newWord);

                    var incorrectWordButton = $("<button type='button' class='btn btn-primary btn-lg incorrect'></button>").append(newWord);
                    $("#wordFindContainer").append(incorrectWordButton);    
                }
                
            
            }
            
            // Say word
            saySlowly("Find. " + word);

            // Wire buttons
            $(".correct").click(function() { correctAnswer(); });
            $(".incorrect").click(function() { incorrect(); });
        };


        sayWord = function() {
            saySlowly($("#correctWord").val());
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
        };

        initialise();
    });