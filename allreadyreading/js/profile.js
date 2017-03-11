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
requirejs(['jquery', 'app/common', 'app/profiles'],
    function($, common, profiles) {

        displayProfile = function() {
            $(".profileButton").click(function() { displayProfile(); });
            $("#userName").empty();
            $("#wordStatistics").empty();

            var currentProfile = getCurrentProfile();
            $("#userName").append(currentProfile.Name);
            $("#voice").val(currentProfile.voiceName);

            if (!currentProfile.wordContainer) { return; }
            var words = Object.getOwnPropertyNames(currentProfile.wordContainer);

            words.sort();


            $.each(words, function(index, word) {
                var wordStats = currentProfile.wordContainer[word];

                var wordDetails = $("<div>").append($("<h4>").append(word));

                var activityTypes = ["Find", "Spell"];
                activityTypes.forEach(function(activity) {
                    var activityStats = wordStats[activity];
                    if (activityStats !== null && activityStats !== undefined) {
                        var activityDetails = $("<div>");
                        activityDetails.append(
                            $("<h5>")
                            .append(activity));
                        var stats = $("<div class='progress progress-striped'>");
                        var correctPercent = activityStats.correctCount / (activityStats.correctCount + activityStats.incorrectCount) * 100;
                        var correctBar = $("<div class='progress-bar progress-bar-success'>")
                            .append("Correct: " + activityStats.correctCount)
                            .attr("style", "width: " + correctPercent + "%");

                        var incorrectPercent = activityStats.incorrectCount / (activityStats.correctCount + activityStats.incorrectCount) * 100;
                        var incorrectBar = $("<div class='progress-bar progress-bar-danger'>")
                            .append("Incorrect: " + activityStats.incorrectCount)
                            .attr("style", "width: " + incorrectPercent + "%");

                        stats.append(correctBar);
                        stats.append(incorrectBar);
                        activityDetails.append(stats);

                        wordDetails.append(activityDetails);
                    }

                }, this);
                wordDetails.append("<hr>");
                $("#wordStatistics").append(wordDetails);

            });
        };

        initialiseWordLists = function() {
            loadSetListList();
            $("#setListsSelection").change(function() { loadSetList(); });
        };

        initialiseVoice();
        initialiseWordLists();
        displayProfile();

    });