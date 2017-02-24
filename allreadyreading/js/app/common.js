define(["jquery", "store", "app/languageCodes", "app/wordlists"],
    function($, store, languageCodes, wordlists) {

        voiceName = "";

        loadSetListList = function() {
            for (var i = 0; i < wordlists.length; i++) {
                wordlists[wordlists[i].setListName] = wordlists[i];
                $("#setListsSelection").append("<option value='" + i + "'>" + wordlists[i].setListName + "</option>");

                var setListName =
                    $("<a href='#'>")
                    .attr("href", "#" + wordlists[i].setListName)
                    .append(wordlists[i].setListName);
                setListName.click(function() { loadSetFromAnchor(this); });
                $("#setListsDropDownList").append($("<li>").append(setListName));
            }
        };

        loadSetFromAnchor = function(anchor) {
            var setName = anchor.href.split("#")[1];
            loadSetFromList(wordlists[setName]);
        };

        loadSetListFromHash = function() {
            var setName = window.location.hash.split("#")[1];
            loadSetListFromName(wordlists[setName]);
        };

        loadSetListFromName = function(setName) {
            loadSetFromList(wordlists[setName]);
        };

        loadVoiceList = function() {
            //Populate voice selection dropdown
            var voicelist = responsiveVoice.getVoices();

            var vselect = $("#voiceselection");

            $.each(voicelist, function() {
                vselect.append($("<option />").val(this.name).text(this.name));

                var voiceOption =
                    $("<a href='#'>")
                    .attr("href", "#" + this.name)
                    .attr("class", "voiceOption")
                    .append(this.name);
                voiceOption.click(function() { loadVoice(this); });
                $("#voiceselectionDropDownList").append($("<li>").append(voiceOption));
            });
        };

        loadVoice = function(anchor) {
            loadVoiceByName(anchor.href.split("#")[1]);
        };

        loadVoiceByName = function(voiceName) {
            store.set("voiceName", voiceName);
            responsiveVoice.setDefaultVoice(voiceName);
        };

        correct = function(){
            say("Correct");
        };
        
        incorrect = function(){
            say("Incorrect");
        };

        saySlowly = function(message) {
            console.log("SPEECH: " + message);
            responsiveVoice.speak(message, voiceName, { rate: 0.75 });
        };

        say = function(message) {
            console.log("SPEECH: " + message);
            responsiveVoice.speak(message);
        };

        initialiseVoice = function() {
            loadVoiceList();

            voiceName = store.get("voiceName");
            if (!voiceName) { voiceName = $(".voiceOption")[0]; }
            loadVoiceByName(voiceName);
        };

        initialiseWordLists = function() {
            loadSetListList();
            $("#setListsSelection").change(function() { loadSetList(); });

            var startingWordSet = store.get("wordSet");
            if (!startingWordSet) { startingWordSet = wordlists[0].setListName; }
            loadSetListFromName(startingWordSet);

            var startingSetList = store.get("setList");
            if (!startingSetList) { startingSetList = wordlists[0].sets[0].setListName; }
        };

    });