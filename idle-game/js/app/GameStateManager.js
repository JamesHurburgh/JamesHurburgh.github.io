/*jshint esversion: 6 */

define([
    "app/CommonFunctions",
    "app/DataManager",
    "alertify"
],
    function GameStateManager(
        CommonFunctions,
        DataManager,
        alertify) {

        common = new CommonFunctions();
        data = new DataManager();
        return function GameStateManager(gameController, gameState, saveFunction) {

            this.externalSaveFunction = saveFunction;
            this.gameState = gameState;
            this.gameController = gameController;

            this.save = function () {
                this.externalSaveFunction(gameState);
            };

            this.reset = function () {
                log("reset");
                this.gameState = this.newGame();
            };

            this.newGame = function () {
                // Then initialise new
                var newGameState = {};
                newGameState.majorTickCounter = 0;

                newGameState.coins = 10;
                newGameState.renown = 0;

                newGameState.runningExpeditions = [];
                newGameState.completedQuests = [];

                // Take a local copy of the locations
                newGameState.locationList = commonFunctions.clone(data.locations);
                this.gameController.LocationManager().setCurrentLocation(newGameState.locationList[0].name);

                this.gameController.LocationManager().getCurrentLocation().availableContracts = [];
                this.gameController.LocationManager().getCurrentLocation().availableAdventurers = [];

                // Initilise options
                newGameState.options = {
                    "claimAllButtons": false,
                    "automaticHire": false,
                    "automaticClaim": false,
                    "automaticSend": false,
                    "automaticRelocate": false,
                    "automaticFreeCoins": false,
                    "showMessageTimeAsRealTime": false
                };

                // Initialise stats
                if (!newGameState.stats) {
                    newGameState.stats = [];
                } else {
                    for (var i = 0; i < newGameState.stats.length; i++) {
                        newGameState.stats[i].current = 0;
                    }
                }
                newGameState.claimedAchievements = [];

                newGameState.ownedItems = [];
                newGameState.messages = [];

                newGameState.currentEffects = [];

                newGameState.selectedContract = null;
                newGameState.selectedAdverturer = null;
                newGameState.currentParty = [];
                newGameState.adventurerList = [];

                newGameState.loginTracker = [];

                newGameState.version = data.game.versions[0].number;

                return newGameState;

            };

            this.versionCheck = function () {
                log("versionCheck");

                // Fix for version 0.10.7

                this.gameController.AdventurerManager().addMissingRace();

                var currentVersion = data.game.versions[0].number;
                if (this.gameState.version != currentVersion) {
                    var releaseNotesButton = '<button class="btn btn-info" data-toggle="modal" data-target="#releaseNotes">Release Notes</button>';
                    var versionUpdateMessage = "Version updated from " + this.gameState.version + " to " + currentVersion + ". Check the " + releaseNotesButton + ".";
                    alertify.delay(10000);
                    alertify.alert("<h2>Version update!</h2><p class='text-info'>" + versionUpdateMessage + "</p>");
                    this.gameState.version = data.game.versions[0].number;
                }
            };

        };
    }
);