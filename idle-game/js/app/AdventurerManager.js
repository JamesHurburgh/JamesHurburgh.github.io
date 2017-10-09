/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "chance",
        "json!data/adventurers.json",
        "json!data/conversations.json"
    ],
    function AdventurerManager(
        CommonFunctions,
        Chance,
        adventurers,
        conversations) {

        commonFunctions = new CommonFunctions();
        chance = new Chance();
        return function AdventurerManager(gameState) {

            this.gameState = gameState;

            this.getCost = function(adventurer) {
                return adventurer.baseCost;
            };

            this.canHire = function(adventurer) {
                return gameState.coins >= this.getCost(adventurer);
            };

            this.hire = function(notice) {
                var adventurer = notice.adventurer;
                if (this.canHire(adventurer)) {
                    gameState.spendCoins(this.getCost(adventurer));
                }

                this.addAdventurer(adventurer);
                this.removeFromAvialableHires(notice);
            };

            this.removeFromAvialableHires = function(notice) {
                gameState.LocationManager().getCurrentLocation().availableAdventurers.splice(gameState.LocationManager().getCurrentLocation().availableAdventurers.indexOf(notice), 1);
            };

            this.convertNumberToAdventurer = function(adventurerType) {
                var idleCount = gameState.getHiredCount(adventurerType);
                if (idleCount <= 0) return;

                gameState.hired[adventurerType]--;

                this.addAdventurer(this.generateAdventurer(adventurerType));
            };

            this.addAdventurer = function(adventurer) {
                if (gameState.adventurerList === undefined || gameState.adventurerList === null) gameState.adventurerList = [];
                gameState.adventurerList.push(adventurer);
            };

            this.generateAdventurer = function(adventurerType) {

                var adventurerTemplate = adventurers.filter(adventurer => adventurer.name == adventurerType)[0];
                if (adventurerTemplate === undefined || adventurerTemplate === null) {
                    // if no template specified, pick random
                    adventurerTemplate = chance.pickone(adventurers);
                }
                // Clone template
                var adventurer = commonFunctions.clone(adventurerTemplate);

                adventurer.type = adventurerType;
                adventurer.id = commonFunctions.uuidv4();
                adventurer.name = {};
                adventurer.name.first = chance.first();
                adventurer.name.last = chance.last();
                adventurer.name.full = adventurer.name.first + " " + adventurer.name.last;
                adventurer.age = Math.floor(Math.random() * 30) + 18;
                adventurer.wage = adventurerTemplate.baseCost;
                adventurer.experience = adventurerTemplate.baseExperience;
                adventurer.status = "Idle";

                return adventurer;
            };

            this.upgradeAdventurer = function(adventurer) {
                chance.pickone(adventurer.skills).amount++;
            };

            this.getAdventurerList = function(){
                if(!gameState.adventurerList){
                    gameState.adventurerList = [];
                }
                return gameState.adventurerList;
            };

            this.getCurrentParty = function() {
                return this.getAdventurerList().filter(adventurer => adventurer.includeInParty);
            };

            this.getCurrentPartyAttributes = function() {
                var party = this.getCurrentParty();

                var allSkills = party.reduce(function(attributeNames, adventurer) {
                    return attributeNames.concat(adventurer.skills);
                }, []);

                var attributes = allSkills.reduce(function(attributes, skill) {
                    var attribute = attributes.filter(attribute => attribute.name == skill.name)[0];
                    if (attribute === undefined || attribute === null) {
                        attributes.push({ "name": skill.name, "amount": skill.amount });
                    } else {
                        attribute.amount += skill.amount;
                    }
                    return attributes;
                }, []);

                return attributes;

            };

            this.sendCurrentParty = function() {
                this.sendParty(this.getCurrentParty());
            };

            this.sendParty = function(party) {
                party.forEach(function(adventurer) {
                    adventurer.status = "Questing";
                    adventurer.includeInParty = false;
                }, this);
            };

            this.getCurrentPartyAttribute = function(attributeName) {
                var party = this.getCurrentParty();

                return party.reduce(function(amount, adventurer) {
                    var attribute = adventurer.skills.filter(skill => skill.name == attributeName)[0];
                    if (!attribute) {
                        return amount;
                    } else {
                        return amount += attribute.amount;
                    }
                }, 0);
            };

            this.getAdventurersAtStatus = function(status) {
                return gameState.adventurerList.filter(adventurer => adventurer.status == status);
            };

            this.getAdventurersQuest = function(adventurer){
                gameState.runningExpeditions.forEach(function(quest) {
                    if(quest.party.filter(a => a == adventurer).length > 0){
                        return quest;
                    }
                }, this);
            };

            this.addNewAdverturersForHire = function() {
                // New hires
                var maxAvailableHires = 5;
                if (!gameState.LocationManager().getCurrentLocation().availableAdventurers) {
                    gameState.LocationManager().getCurrentLocation().availableAdventurers = [];
                }
                if (gameState.LocationManager().getCurrentLocation().availableAdventurers.length < maxAvailableHires && Math.random() < gameState.getGlobalValue("chanceOfNewHire")) {
                    this.addAvailableHire();
                }
            };

            this.addAvailableHire = function() {
                // Choose type from location list first, then look it up.
                var location = gameState.LocationManager().getCurrentLocation();
                var locationHireableTypes = location.adventurers;

                if (locationHireableTypes === undefined || locationHireableTypes.length === 0) { return; }

                // Start function
                var weightedList = [];
                var min = 0;
                var max = 0;
                for (var i = 0; i < locationHireableTypes.length; i++) {
                    max += locationHireableTypes[i].chance;
                    weightedList.push({ item: locationHireableTypes[i], min: min, max: max });
                    min += locationHireableTypes[i].chance;
                }
                var chance = max * Math.random();
                var selection = weightedList.filter(item => item.min <= chance && item.max >= chance)[0].item;
                // End function

                var adventurerType = selection.type;

                var adventurerNotice = {
                    "adventurer": this.generateAdventurer(adventurerType),
                    "expires": Date.now() + Math.floor(gameState.millisecondsPerSecond * gameState.getGlobalValue("averageHireContractExpiry") * (Math.random() + 0.5))
                };

                gameState.LocationManager().getCurrentLocation().availableAdventurers.push(adventurerNotice);
                gameState.LocationManager().getCurrentLocation().availableAdventurers.sort(function(a, b) {
                    return a.expires - b.expires;
                });
                gameState.trackStat("available-adventurer", adventurerType, 1);
                gameState.trackStat("available", "adventurers", 1);
            };

            this.talkTo = function(adventurerName) {
                gameState.message(adventurerName + " says '" + chance.pickone(conversations.randomStatements) + "'");
            };

            this.prepAdventurersQueue = function(millisecondsSinceLastLogin) {
                var numberToPrep = Math.min(millisecondsSinceLastLogin / 1000 / 60 / 10, 5); // Prep one every 10 minutes
                for (var i = 0; i < numberToPrep; i++) {
                    this.addAvailableHire();
                }
            };

        };
    }
);