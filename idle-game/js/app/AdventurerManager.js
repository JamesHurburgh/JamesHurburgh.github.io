/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "app/DataManager",
        "app/QuestManager",
        "chance",
        "json!data/conversations.json"
    ],
    function AdventurerManager(
        CommonFunctions,
        DataManager,
        QuestManager,
        Chance,
        conversations) {

        common = new CommonFunctions();
        data = new DataManager();
        this.chance = new Chance();
        Quests = new QuestManager();

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
                } else {
                    adventurer.race = data.races.filter(race => race.name == adventurer.race.name)[0];
                }
                if (adventurer.birthTime === undefined || adventurer.birthTime === null || isNaN(adventurer.birthTime)) {
                    adventurer.birthTime = Date.now() - (adventurer.age * 518400000) - (Math.random() * 518400000);
                }

                if (!adventurer.gender) {
                    adventurer.gender = chance.pickone(["male", "female"]);
                    adventurer.name.first = chance.first({ gender: adventurer.gender });
                    adventurer.name.full = adventurer.name.first + " " + adventurer.name.last;
                }

                adventurer.symbol = data.adventurers.filter(type => type.name == adventurer.type)[0].symbol;


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
                    this.addAdventurer(adventurer);
                    this.removeFromAvialableHires(notice);
                    this.trackAdventurerStats(adventurer, "hire", 1);
                }
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
                adventurer.gender = chance.pickone(["male", "female"]);
                adventurer.name = {};
                adventurer.name.first = chance.first({ gender: adventurer.gender });
                adventurer.name.last = chance.last();
                adventurer.name.full = adventurer.name.first + " " + adventurer.name.last;
                var age = Math.floor(Math.random() * (raceTemplate.oldAge - raceTemplate.matureAge)) + raceTemplate.matureAge;
                adventurer.birthTime = Date.now() - (age * 518400000) - (Math.random() * 518400000);
                adventurer.wage = common.varyFloat(adventurerTemplate.baseCut, 0.3);
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

            this.getPartyAttributes = function(party) {

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

            this.getCurrentPartyAttributes = function() {
                var party = this.getCurrentParty();
                return this.getPartyAttributes(party);

            };

            this.sendCurrentParty = function() {
                this.sendParty(this.getCurrentParty());
            };

            this.sendParty = function(party) {
                party.forEach(function(adventurer) {
                    adventurer.status = "Questing";
                    adventurer.includeInParty = false;
                    this.trackAdventurerStats(adventurer, "send", 1);
                }, this);
                this.gameController.StatisticsManager().trackStat("send", "party");
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
                Quests.getRunningQuests().forEach(function(quest) {
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
                    this.trackAdventurerStats(adventurer, "available", 1);
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

            this.prepAdventurersQueue = function(numberToPrep) {
                for (var i = 0; i < numberToPrep; i++) {
                    this.addAvailableHire();
                }
            };

            this.getAge = function(adventurer) {
                return Math.floor((Date.now() - adventurer.birthTime) / 518400000);
            };

            this.getAgeAtDeath = function(adventurer) {
                if (!adventurer.timeOfDeath) adventurer.timeOfDeath = Date.now();
                return Math.floor((adventurer.timeOfDeath - adventurer.birthTime) / 518400000);
            };

            this.giveAdventurerCoins = function(adventurer, coinsGained) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.coins) adventurer.coins = 0;
                adventurer.coins += coinsGained;
                this.trackAdventurerStats(adventurer, "give-coins", coinsGained);
            };

            this.giveAdventurerXP = function(adventurer, xpGained) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.experience) adventurer.experience = 0;
                adventurer.experience += xpGained;
                this.trackAdventurerStats(adventurer, "give-xp", xpGained);

            };

            this.trackAdventurerStats = function(adventurer, action, amount) {
                this.gameController.StatisticsManager().trackStats(action, ["adventurer", adventurer.type, adventurer.race.name, adventurer.gender], amount);
            };

            this.recoverAdventurers = function() {
                // Make sure any idle adventurers are at the correct status.
                var idleAdventurers = this.getAdventurersAtStatus("Idle").filter(adventurer => adventurer.injuries !== undefined && adventurer.injuries.length > 0);
                idleAdventurers.forEach(function(adventurer) {
                    adventurer.status = "Injured";
                });

                var healingAdventures = this.getAdventurersAtStatus("Injured").filter(adventurer => adventurer.injuries.filter(injury => injury.healTime <= Date.now()).length > 0);
                healingAdventures.forEach(function(adventurer) {

                    var healedInjuries = adventurer.injuries.filter(injury => injury.healTime <= Date.now());
                    var healTime = 0;
                    healedInjuries.forEach(function(injury) {
                        healTime = Math.max(healTime, injury.healTime);
                        adventurer.injuries.splice(adventurer.injuries.indexOf(injury));
                    }, this);

                    if (adventurer.injuries.length === 0) {
                        this.setAdventurerRecovering(adventurer, healTime);
                    }
                }, this);

                var adventures = this.getAdventurersAtStatus("Recovering").filter(adventurer => !adventurer.recoverTime || adventurer.recoverTime <= Date.now());
                adventures.forEach(function(adventurer) {
                    adventurer.status = "Idle";
                    adventurer.recoverTime = null;
                    this.trackAdventurerStats(adventurer, "recover", 1);

                }, this);

            };

            this.returnFromQuest = function(adventurer, timeReturned) {
                if (!adventurer) return;
                if (!timeReturned) timeReturned = Date.now();
                if (adventurer.injuries && adventurer.injuries.length !== 0) {
                    adventurer.injuries.forEach(function(injury) {
                        injury.healTime = timeReturned + injury.timeToHeal;
                    }, this);
                    adventurer.status = "Injured";
                } else {
                    this.setAdventurerRecovering(adventurer, timeReturned);
                }
            };

            this.setAdventurerRecovering = function(adventurer, healTime) {
                if (!healTime) healTime = Date.now();
                adventurer.status = "Recovering";
                adventurer.recoverTime = healTime + 1440000; // Recover for one day
                this.trackAdventurerStats(adventurer, "heal", 1);
            };

            this.generateInjury = function(anatomy, injuryTime) {
                if (!injuryTime) injuryTime = Date.now();
                var timeToHeal = Math.floor(Math.random() * 7 * 1440000) + 1440000; // Recover for at least one day, up to a week.
                return {
                    injuryType: "Injured",
                    bodyPart: chance.pickone(anatomy.bodyparts),
                    timeToHeal: timeToHeal,
                    healTime: injuryTime + timeToHeal
                };
            };

            this.injureAdventurerOnQuest = function(adventurer, injuryType, injuryTime) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.injuries) adventurer.injuries = [];

                var anatomy = data.anatomy.filter(a => a.race == adventurer.race.name)[0];

                var injury = this.generateInjury(anatomy, injuryTime);
                adventurer.injuries.push(injury);

                // Probably do some other stuff

                this.trackAdventurerStats(adventurer, "injure", 1);
                if (adventurer.injuries.length > 2) {
                    this.killAdventurer(adventurer, injury, injuryTime);
                }
                return injury;
            };

            this.injureAdventurer = function(adventurer, causeOfInjury, injuryTime) {
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                if (!adventurer.injuries) adventurer.injuries = [];

                var anatomy = data.anatomy.filter(a => a.race == adventurer.race.name)[0];

                var injury = this.generateInjury(anatomy, injuryTime);
                adventurer.injuries.push(injury);
                adventurer.status = "Injured";
                this.trackAdventurerStats(adventurer, "injure", 1);
                if (adventurer.injuries.length > 2) {
                    this.killAdventurer(adventurer, injury, injuryTime);
                }
                return injury;
            };

            this.killAdventurer = function(adventurer, causeOfDeath, timeOfDeath) {
                if (!timeOfDeath) timeOfDeath = Date.now();
                adventurer = this.gameState.adventurerList.filter(a => a.id == adventurer.id)[0];
                adventurer.status = "Dead";
                adventurer.timeOfDeath = timeOfDeath;
                adventurer.causeOfDeath = causeOfDeath;
                this.trackAdventurerStats(adventurer, "death", 1);
            };
        };
    }
);