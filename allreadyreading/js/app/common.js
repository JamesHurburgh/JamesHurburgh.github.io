define(["jquery", "store", "app/languageCodes", "app/wordlists", 'app/profiles'],
    function($, store, languageCodes, wordlists, profiles) {

        voiceName = "";
        profileName = "";

        loadSetListList = function() {
            for (var i = 0; i < wordlists.length; i++) {
                wordlists[wordlists[i].setListName] = wordlists[i];
                $("#setListsSelection").append("<option value='" + i + "'>" + wordlists[i].setListName + "</option>");

                var setListName =
                    $("<a href='#'>")
                    .attr("href", "#" + wordlists[i].setListName)
                    .append(wordlists[i].setListName);
                setListName.click(function() { loadSetListFromName(this.href.split("#")[1]); });
                $("#setListsDropDownList").append($("<li>").append(setListName));
            }
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
            var profile = getCurrentProfile();
            profile.voiceName = voiceName;
            updateProfile(profile);
            responsiveVoice.setDefaultVoice(voiceName);
        };

        correct = function() {
            say("Correct");
        };

        incorrect = function() {
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

            voiceName = getCurrentProfile().voiceName;
            if (!voiceName || typeof voiceName != 'string') { voiceName = $(".voiceOption")[0].innerText; }
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

        updateProfileStatistic = function(word, activity, isCorrect) {
            var profile = getCurrentProfile();
            if (!profile.wordContainer) { profile.wordContainer = {}; }
            profile.wordContainer[word] = updateWordStatistic(profile.wordContainer[word], activity, isCorrect);
            updateProfile(profile);
        };

        updateWordStatistic = function(wordStatistics, activity, isCorrect) {
            if (!wordStatistics) { wordStatistics = {}; }
            wordStatistics[activity] = updateActivityStatistics(wordStatistics[activity], isCorrect);
            return wordStatistics;
        };

        updateActivityStatistics = function(activityStatistics, isCorrect) {
            if (!activityStatistics) {
                activityStatistics = {
                    "correctCount": 0,
                    "incorrectCount": 0,
                };
            }
            if (isCorrect) {
                activityStatistics.correctCount += 1;
            } else {
                activityStatistics.incorrectCount += 1;
            }
            // TODO add date markers

            return activityStatistics;
        };

        loadProfileList = function() {
            var profileList = getLocalProfiles();
            $("#usersDropDownList").empty();
            $("#listOfProfiles").empty();
            profileList.forEach(function(profileName) {
                $("#listOfProfiles").append(profileName);

                var profileImage =
                    $("<img/>")
                    .attr("src", "https://robohash.org/" + profileName + ".png?size=40x40");
                var profileLink =
                    $("<a class='profileButton'/>")
                    .attr("href", "#" + profileName)
                    .append(profileName)
                    .append(profileImage);

                $("#usersDropDownList").append($("<li>").append(profileLink));

            });

            $(".profileButton").click(function() {
                loadProfile(this.href.split("#")[1]);
            });
        };

        loadProfile = function(profileName) {
            setCurrentProfile(profileName);
            loadCurrentUser();
        }

        loadCurrentUser = function() {

            var profile = getCurrentProfile();
            loadProfileList();

            var profileName = profile.Name;
            $("#currentUser").empty();
            $("#currentUser").append(profileName);
            $("#currentUserImg").attr("src", "https://robohash.org/" + profileName + ".png?size=40x40");

        };

        loadProfileList();
        loadCurrentUser();

        $("#addProfileButton").click(function() {
            addProfile({ "Name": $("#newProfileName").val() });
            loadProfileList();
        });

    });