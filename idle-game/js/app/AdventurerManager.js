/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "app/DataManager",
        "chance",
        "json!data/conversations.json"
    ],
    function AdventurerManager(
        CommonFunctions,
        DataManager,
        Chance,
        conversations) {

        common = new CommonFunctions();
        data = new DataManager();
        this.chance = new Chance();
        return function AdventurerManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getAdventurerList = function() {
                if (!this.gameState.adventurerList) this.gameState.adventurerList = [];
                return this.gameState.adventurerList;
            };

            this.showAdventurerTab = function() {
                return this.getAdventurerList().length !== 0;
            };

            this.addMissingFieldsToAdventurer = function(adventurer) {
                if (!adventurer.age) {
                    var age = Math.floor(Math.random() * (adventurer.race.oldAge - adventurer.race.matureAge)) + adventurer.race.matureAge;
                    adventurer.age = age;
                }
                if (!adventurer.race) {
                    adventurer.race = data.races[0];
                }
                if (adventurer.birthTime === undefined || adventurer.birthTime === null || isNaN(adventurer.birthTime)) {
                    adventurer.birthTime = Date.now() - (adventurer.age * 518400000) - (Math.random() * 518400000);
                }

            };

            this.addMissingFields = function() {
                var adventurerList = this.getAdventurerList();
                for (var i = 0; i < adventurerList.length; i++) {
                    this.addMissingFieldsToAdventurer(adventurerList[i]);
                }

                adventurerList = this.gameController.LocationManager().getCurrentLocation().availableAdventurers;
                if (!adventurerList) return;
                adventurerList.forEach(function(notice) {
                    this.addMissingFieldsToAdventurer(notice.adventurer);
                }, this);
            };

            this.getCost = function(adventurer) {
                return adventurer.baseCost;
            };

            this.canHire = function(adventurer) {
                return this.gameState.coins >= this.getCost(adventurer);
            };

            this.hire = function(notice) {
                var adventurer = notice.adventurer;
                if (this.canHire(adventurer)) {
                    this.gameController.PlayerManager().spendCoins(this.getCost(adventurer));
                }

                this.addAdventurer(adventurer);
                this.removeFromAvialableHires(notice);
            };

            this.removeFromAvialableHires = function(notice) {
                this.gameController.LocationManager().getCurrentLocation().availableAdventurers.splice(this.gameController.LocationManager().getCurrentLocation().availableAdventurers.indexOf(notice), 1);
            };

            this.addAdventurer = function(adventurer) {
                if (this.gameState.adventurerList === undefined || this.gameState.adventurerList === null) this.gameState.adventurerList = [];
                this.gameState.adventurerList.push(adventurer);
            };

            this.generateAdventurer = function(adventurerTemplate, raceTemplate) {
                if (adventurerTemplate === undefined || adventurerTemplate === null) throw new Error("adventurerTemplate is not set");
                if (raceTemplate === undefined || raceTemplate === null) throw new Error("raceTemplate is not set");

                // Clone template
                var adventurer = common.clone(adventurerTemplate);

                adventurer.type = adventurerTemplate.name;
                adventurer.race = raceTemplate;
                adventurer.id = common.uuidv4();
                adventurer.name = {};
                adventurer.name.first = chance.first();
                adventurer.name.last = chance.last();
                adventurer.name.full = adventurer.name.first + " " + adventurer.name.last;
                var age = Math.floor(Math.random() * (raceTemplate.oldAge - raceTemplate.matureAge)) + raceTemplate.matureAge;
                adventurer.birthTime = Date.now() - (age * 518400000) - (Math.random() * 518400000);
                adventurer.wage = common.varyFloat(adventurerTemplate.baseCost, 0.3);
                adventurer.coins = Math.floor(Math.random() * 10);
                adventurer.experience = adventurerTemplate.baseExperience;
                adventurer.status = "Idle";

                return adventurer;
            };

            this.upgradeAdventurer = function(adventurer) {
                chance.pickone(adventurer.skills).amount++;
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
                return this.gameState.adventurerList.filter(adventurer => adventurer.status == status);
            };

            this.countAdventurersAtStatus = function(status) {
                return this.gameState.adventurerList.filter(adventurer => adventurer.status == status).length;
            };

            this.getAdventurersQuest = function(adventurer) {
                if (adventurer.status != "Questing") return;
                var questResult;
                this.gameController.QuestManager().getRunningQuests().forEach(function(quest) {
                    if (quest.party.filter(a => a.id == adventurer.id).length > 0) {
                        questResult = quest;
                    }
                }, this);
                // TODO This is a workaround for the bug that set some adventurers to Questing and never resets them.
                if (questResult === undefined) {
                    adventurer.status = "Idle";
                }
                return questResult;
            };

            this.addNewAdverturersForHire = function() {
                // New hires
                var maxAvailableHires = 5;
                if (!this.gameController.LocationManager().getCurrentLocation().availableAdventurers) {
                    this.gameController.LocationManager().getCurrentLocation().availableAdventurers = [];
                }
                if (this.gameController.LocationManager().getCurrentLocation().availableAdventurers.length < maxAvailableHires && Math.random() < this.gameController.EffectsManager().getGlobalValue("chanceOfNewHire")) {
                    this.addAvailableHire();
                }
            };

            this.addAvailableHire = function() {
                // Choose type from location list first, then look it up.
                var location = this.gameController.LocationManager().getCurrentLocation();
                var locationHireableTypes = location.adventurers;

                if (locationHireableTypes === undefined || locationHireableTypes.length === 0) { return; }

                var adventurerType = common.pickFromWeightedList(locationHireableTypes).type;
                var adventurerTemplate = data.adventurers.filter(a => a.name == adventurerType)[0];
                var raceTemplate = common.pickFromWeightedList(data.races);

                try {
                    var adventurer = this.generateAdventurer(adventurerTemplate, raceTemplate);
                    var adventurerNotice = {
                        "adventurer": adventurer,
                        "expires": Date.now() + Math.floor(1000 * this.gameController.EffectsManager().getGlobalValue("averageHireContractExpiry") * (Math.random() + 0.5))
                    };

                    this.gameController.LocationManager().getCurrentLocation().availableAdventurers.push(adventurerNotice);
                    this.gameController.LocationManager().getCurrentLocation().availableAdventurers.sort(function(a, b) {
                        return a.expires - b.expires;
                    });
                    this.gameController.StatisticsManager().trackStat("available-adventurer", adventurerTemplate.name, 1);
                    this.gameController.StatisticsManager().trackStat("available", "adventurers", 1);
                } catch (error) {
                    log(error);
                }
            };

            this.updateQuotes = function() {
                var adventures = this.getAdventurersAtStatus("Idle").filter(adventurer => !adventurer.quoteExpires || adventurer.quoteExpires <= Date.now());
                adventures.forEach(function(adventurer) {
                    adventurer.quote = this.getQuote(adventurer);
                    adventurer.quoteExpires = Math.floor(Date.now() + 60000 + Math.random() * 1440000);
                }, this);
            };

            this.getQuote = function(adventurer) {
                return chance.pickone(data.conversations.randomStatements);
            };

            this.talkTo = function(adventurerName) {
                this.gameController.MessageManager().message(adventurerName + " says '" + this.getQuote() + "'");
            };

            this.prepAdventurersQueue = function(numberToPrep) {
                for (var i = 0; i < numberToPrep; i++) {
                    this.addAvailableHire();
                }
            };

            this.getAge = function(adventurer) {
                return Math.floor((Date.now() - adventurer.birthTime) / 518400000);
            };

            this.giveAdventurerCoins = function(adventurer, coinsGained) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.coins) adventurer.coins = 0;
                adventurer.coins += coinsGained;
            };

            this.giveAdventurerXP = function(adventurer, xpGained) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.experience) adventurer.experience = 0;
                adventurer.experience += xpGained;
            };

            this.recoverRecoveredAdventureres = function() {
                var adventures = this.getAdventurersAtStatus("Recovering").filter(adventurer => !adventurer.recoverTime || adventurer.recoverTime <= Date.now());
                adventures.forEach(function(adventurer) {
                    adventurer.status = "Idle";
                    adventurer.recoverTime = null;
                }, this);
            };

        };
    }
);