/*jshint esversion: 6 */

define(["jquery",
        "app/CommonFunctions",
        "alertify",
        "json!data/game.json",
        "json!data/settings.json",
        "app/ItemManager",
        "app/LocationManager",
        "app/AdventurerManager",
        "app/QuestManager",
        "json!data/calendar.json",
        "json!data/contracts.json",
        "json!data/locations.json",
        "json!data/adventurers.json",
        "json!data/renown.json",
        "json!data/achievements.json",
        "json!data/skills.json"
    ],
    function AdventurersGame(
        jquery,
        CommonFunctions,
        alertify,
        game,
        settings,
        ItemManager,
        LocationManager,
        AdventurerManager,
        QuestManager,
        calendar,
        contracts,
        locations,
        adventurers,
        renown,
        achievements,
        skills) {


        var data = {
            achievements: achievements,
            adventurers: adventurers,
            //adversaries: adversaries,
            skills: skills,
            calendar: calendar,
            contracts: contracts,
            //conversations: conversations,
            game: game,
            items: items,
            locations: locations,
            renown: renown,
            settings: settings
        };

        commonFunctions = new CommonFunctions();

        return function AdventurersGame(saveData, autoSaveFunction) {

            this.autoSave = autoSaveFunction;
            this.millisecondsPerSecond = 1000;

            _itemManager = new ItemManager(this);
            this.ItemManager = function() {
                return _itemManager;
            };
            _locationManager = new LocationManager(this);
            this.LocationManager = function() {
                return _locationManager;
            };

            _AdventurerManager = new AdventurerManager(this);
            this.AdventurerManager = function() {
                return _AdventurerManager;
            };

            _QuestManager = new QuestManager(this);
            this.QuestManager = function() {
                return _QuestManager;
            };

            this.getGameTime = function(dateInMilliSeconds) {

                if (dateInMilliSeconds === undefined || dateInMilliSeconds === null) {
                    dateInMilliSeconds = Date.now();
                }

                var gameDateTime = {};
                gameDateTime.realDateTime = dateInMilliSeconds;

                var gameMinutes = dateInMilliSeconds / 1000;
                gameDateTime.minutes = Math.floor(gameMinutes % 60);

                var gameHours = Math.floor(gameMinutes / 60);
                gameDateTime.hours = (gameHours % 24);

                gameDateTime.timeOfDay = calendar.timeOfDay[gameDateTime.hours];

                gameDateTime.amPm = "am";
                if (gameDateTime.hours >= 12) gameDateTime.amPm = "pm";
                gameDateTime.hours = (gameHours % 12);
                if (gameDateTime.hours === 0) gameDateTime.hours = 12;

                gameDateTime.timeColour = gameDateTime.timeOfDay.colourHex;

                var gameDate = Math.floor(gameHours / 24);
                gameDateTime.date = (gameDate % 30) + 1;
                gameDateTime.gameDateOrdinalIndicator = commonFunctions.nth(gameDateTime.date);

                var gameMonth = Math.floor(gameDate / 30);
                var gameMonthNumber = (gameMonth % 12) + 1;
                gameDateTime.month = calendar.months[gameMonthNumber - 1];
                gameDateTime.monthName = gameDateTime.month.name;

                gameDateTime.season = gameDateTime.month.season;

                gameDateTime.year = Math.floor(gameMonth / 12);

                gameDateTime.holiday = calendar.holidays.filter(holiday => holiday.occurs.month == gameDateTime.month.name && holiday.occurs.date == gameDateTime.date)[0];

                gameDateTime.toDateString = function() {
                    return this.date + this.gameDateOrdinalIndicator + " of " + this.monthName + " " + this.year;
                };

                gameDateTime.toTimeString = function() {
                    return this.hours + ":" + this.minutes.toString().padStart(2, "0") + this.amPm;
                };

                gameDateTime.toString = function() {
                    return this.toTimeString() + " " + this.toDateString();
                };

                gameDateTime.toFullString = function() {
                    return this.timeOfDay.description + " - " + this.toTimeString() + " " + this.toDateString() + " - " + this.season;
                };

                return gameDateTime;

            };

            this.reset = function() {
                console.log("reset");
                // Then initialise new
                this.calculateCounter = 0;

                this.coins = 10;
                this.renown = 0;
                this.freeCoinsTimeout = 0;

                this.hired = {};

                this.runningExpeditions = [];
                this.completedExpeditions = [];

                // Take a local copy of the locations
                this.allLocations = commonFunctions.clone(locations);
                this.LocationManager().setCurrentLocation(this.allLocations[0].name);

                this.LocationManager().getCurrentLocation().availableContracts = [];
                this.LocationManager().getCurrentLocation().availableAdventurers = [];

                // Initilise options
                this.options = {
                    "claimAllButtons": false,
                    "automaticHire": false,
                    "automaticClaim": false,
                    "automaticSend": false,
                    "automaticRelocate": false,
                    "automaticFreeCoins": false,
                    "showMessageTimeAsRealTime": false
                };

                // Initialise stats
                if (!this.stats) {
                    this.stats = [];
                } else {
                    for (var i = 0; i < this.stats.length; i++) {
                        this.stats[i].current = 0;
                    }
                }
                this.claimedAchievements = [];

                this.ownedItems = [];
                this.messages = [];

                this.currentEffects = [];

                this.selectedContract = null;
                this.selectedAdverturer = null;
                this.currentParty = [];
                this.adventurerList = [];

                this.loginTracker = [];

                this.version = game.versions[0].number;

                // Data
                this.adventurers = adventurers;
                this.contracts = contracts;
                this.locations = locations;
                this.achievements = achievements;
                this.items = items;
                this.game = game;
                this.data = data;

                this.calculate();
            };

            this.calculate = function() {
                console.log("calculate");
                // Do all calculations here
                this.calculateCounter = 0;

                this.addNewContracts();
                this.AdventurerManager().addNewAdverturersForHire();

                this.checkAndClaimAllAchievements();

                this.gameDateTime = this.getGameTime();

                // Autosave
                this.stillLoggedIn();
                this.autoSave();
            };

            this.loadFromSavedData = function(savedData) {
                console.log("loadFromSavedData");

                this.coins = savedData.coins;
                this.renown = savedData.renown;
                if (savedData.reknown !== undefined) {
                    this.renown = savedData.reknown;
                }
                this.freeCoinsTimeout = savedData.freeCoinsTimeout;

                this.hired = savedData.hired;

                this.runningExpeditions = savedData.runningExpeditions;
                this.completedExpeditions = savedData.completedExpeditions;

                this.allLocations = savedData.allLocations;
                this.location = savedData.location;
                this.LocationManager().getCurrentLocation().availableContracts = savedData.location.availableContracts;
                this.LocationManager().getCurrentLocation().availableAdventurers = savedData.location.availableAdventurers;
                if (this.LocationManager().getCurrentLocation().availableAdventurers === undefined) this.LocationManager().getCurrentLocation().availableAdventurers = [];

                this.options = savedData.options;
                if (this.options !== undefined && this.options.automatic !== undefined) {
                    {
                        this.automaticHire = this.options.automatic;
                        this.automaticClaim = this.options.automatic;
                        this.automaticSend = this.options.automatic;
                        this.automaticRelocate = this.options.automatic;
                        this.automaticFreeCoins = this.options.automatic;
                        this.options.automatic = undefined;
                    }
                }
                if (this.options === undefined) {
                    this.options = {
                        "claimAllButtons": false,
                        "automaticHire": false,
                        "automaticClaim": false,
                        "automaticSend": false,
                        "automaticRelocate": false,
                        "automaticFreeCoins": false,
                        "showMessageTimeAsRealTime": false
                    };
                }

                this.stats = savedData.stats;
                if (this.stats === undefined) {
                    this.stats = [];
                }
                this.claimedAchievements = savedData.claimedAchievements;
                if (this.claimedAchievements === undefined) {
                    this.claimedAchievements = [];
                }
                this.ownedItems = savedData.ownedItems;
                if (this.ownedItems === undefined) {
                    this.ownedItems = [];
                }
                this.messages = savedData.messages;
                if (this.messages === undefined) {
                    this.messages = [];
                }
                this.currentEffects = savedData.currentEffects;
                if (this.currentEffects === undefined) {
                    this.currentEffects = [];
                }

                this.selectedContract = null;
                this.selectedAdverturer = null;
                this.currentParty = [];

                this.adventurerList = savedData.adventurerList;
                if (this.adventurerList === undefined) this.adventurerList = [];
                this.availableAdventurers = savedData.availableAdventurers;
                if (this.availableAdventurers === undefined) this.availableAdventurers = [];

                this.loginTracker = savedData.loginTracker;

                // Begin standard version management
                if (savedData.version === undefined) {
                    if (!this.LocationManager().getCurrentLocation().availableContracts) this.LocationManager().getCurrentLocation().availableContracts = [];
                    if (!this.LocationManager().getCurrentLocation().availableHires) this.LocationManager().getCurrentLocation().availableHires = [];
                    if (!this.allLocations) this.allLocations = clone(locations);
                    if (!this.renown) this.renown = 0;
                    if (!this.coins) this.coins = 0;
                }

                this.version = game.versions[0].number;
                if (savedData.version != this.version) {
                    var releaseNotesButton = '<button class="btn btn-info" data-toggle="modal" data-target="#releaseNotes">Release Notes</button>';
                    var versionUpdateMessage = "Version updated from " + savedData.version + " to " + this.version + ". Check the " + releaseNotesButton + ".";
                    alertify.delay(10000);
                    alertify.alert("<h2>Version update!</h2><p class='text-info'>" + versionUpdateMessage + "</p>");
                }

                // Data
                this.adventurers = adventurers;
                this.contracts = contracts;
                this.locations = locations;
                this.achievements = achievements;
                this.game = game;
                this.items = items;
                this.data = data;

                for (var i = 0; i < this.allLocations.length; i++) {
                    this.allLocations[i].contracts = this.locations[i].contracts;
                    this.allLocations[i].adventurers = this.locations[i].adventurers;
                }

                this.calculate();
            };
            // Login
            this.login = function() {
                this.timeSinceLastLogin = -1;
                var loginTime = Date.now();
                if (this.loginTracker === undefined) {
                    this.loginTracker = [];
                } else {
                    this.timeSinceLastLogin = loginTime - this.loginTracker[this.loginTracker.length - 1].logout;
                }
                this.loginTracker.push({ "login": loginTime });
            };

            this.stillLoggedIn = function() {
                if (this.loginTracker === undefined) {
                    this.loginTracker = [];
                    this.loginTracker.push({ "login": Date.now() });
                }
                this.loginTracker[this.loginTracker.length - 1].logout = Date.now();
            };

            // Achievements
            this.hasAchievement = function(achievement) {
                return this.claimedAchievements.filter(claimedAchievement => claimedAchievement.name == achievement.name).length > 0;
            };

            this.claimAchievement = function(achievement) {
                if (!this.hasAchievement(achievement.name)) {
                    this.claimedAchievements.push({ "name": achievement.name, "timeClaimed": Date.now() });
                    this.message("Got achievement:" + achievement.name + " (" + achievement.description + ")");
                }
            };

            this.canClaimAchievement = function(achievement) {
                if (this.hasAchievement(achievement)) {
                    return false;
                }
                switch (achievement.trigger.type) {
                    case "statistic":
                        var stat = this.getStat(achievement.trigger.statistic);
                        return stat && stat.current > achievement.trigger.statisticamount;
                }
            };

            this.checkAndClaimAchievement = function(achievement) {
                if (this.canClaimAchievement(achievement)) {
                    this.claimAchievement(achievement);
                }
            };

            this.checkAndClaimAllAchievements = function() {
                for (var i = 0; i < achievements.length; i++) {
                    this.checkAndClaimAchievement(achievements[i]);
                }
            };

            this.achievementProgress = function(achievement) {
                if (this.hasAchievement(achievement)) {
                    return 100;
                }
                switch (achievement.trigger.type) {
                    case "statistic":
                        var stat = this.getStat(achievement.trigger.statistic);
                        if (stat) {
                            return (stat.current / achievement.trigger.statisticamount) * 100;
                        }
                }
                return 0;
            };

            // Stats
            this.getStatName = function(action, subject) {
                return (action + "-" + subject).toLowerCase().replace(/ /g, "_");
            };

            this.getStat = function(name) {
                return this.stats.filter(stat => stat.name == name)[0];
            };

            this.trackStat = function(action, subject, amount) {
                var name = this.getStatName(action, subject);
                stat = this.getStat(name);
                if (!stat) {
                    this.stats.push({ name: name, current: amount, allTime: amount });
                } else {
                    stat.current += amount;
                    stat.allTime += amount;
                }
            };

            this.filteredStats = function(filter) {
                if (!filter) {
                    return this.stats;
                }
                return this.stats.filter(stat => stat.name.indexOf(filter.toLowerCase().trim()) !== -1);
            };

            // Options
            this.cheat = function() {
                console.log("cheat");
                this.giveCoins(100000000000);
                this.giveRenown(100000000000);

                for (var i = 0; i < adventurers.length; i++) {
                    this.hired[adventurers[i].name] += 100000;
                }
            };

            this.toggleClaimAll = function() {
                this.options.claimAllButtons = !this.options.claimAllButtons;
            };

            this.claimAllVisible = function() {
                return this.options.claimAllButtons && this.completedExpeditions.length > 0;
            };

            this.startAllVisible = function() {
                return this.options.claimAllButtons && this.LocationManager().getCurrentLocation().availableContracts.length > 0;
            };

            this.hireAllVisible = function() {
                return this.options.claimAllButtons && this.LocationManager().getCurrentLocation().availableHires.length > 0;
            };

            this.toggleAutomatic = function() {
                this.options.automatic = !this.options.automatic;
            };

            // Renown
            this.renownText = function() {
                return renown.filter(r => r.minimum <= this.renown && r.maximum > this.renown)[0].name;
            };

            // Messages
            this.recentMessages = function() {
                return this.messages.filter(message => message.time + 60000 > Date.now());
            };

            this.message = function(message) {
                alertify.alert(message);
                this.messages.unshift({ "id": commonFunctions.uuidv4, "message": message, "time": Date.now() });
            };

            this.dismissMessage = function(message) {
                this.messages.splice(this.messages.indexOf(message), 1);
            };

            // Globals
            this.getGlobalValue = function(name) {
                var global = this.game.globals.filter(global => global.name == name)[0];
                if (global === undefined) { return null; }
                var effects = this.currentEffects.filter(effect => effect.affects === name);
                var value = global.baseValue;
                for (var i = 0; i < effects.length; i++) {
                    value *= effects[i].valueModifier;
                }
                return value;
            };

            // Effect
            this.addEffect = function(name, valueModifier, expires) {
                this.currentEffects.push({ "name": name, "valueModifier": valueModifier, "expires": expires });
            };

            // Coins
            this.canGetFreeCoins = function() {
                return this.freeCoinsTimeout <= 0;
            };

            this.freeCoins = function(location) {
                var amount = location.freeCoins * this.getGlobalValue("freeCoinsModifier");
                this.giveCoins(amount);
                this.trackStat("click", "free-coins", 1);
                this.trackStat("collect", "free-coins", amount);
                this.freeCoinsTimeout = location.freeCoinsTimeout;
            };

            this.spendCoins = function(coins) {
                this.coins -= coins;
                this.trackStat("spend", "coins", coins);
            };

            this.giveCoins = function(amount) {
                $('#footerCoin').animateCss('bounce');
                this.trackStat("get", "coins", amount);
                this.coins += amount;
            };

            // Adventurers
            this.hiredAdventurers = function() {
                return adventurers.filter(hireable => this.totalAdventurers(hireable) > 0);
            };

            this.totalAdventurers = function(adventurer) {
                return this.getHiredCount(adventurer.name) + this.getAdventurersOnTheJob(adventurer.name);
            };

            this.canHire = function(name) {
                return this.coins >= this.getCost(name);
            };

            this.getHireable = function(name) {
                return adventurers.filter(hireable => hireable.name == name)[0];
            };

            this.getAllHireableAdventurers = function() {
                return this.LocationManager().getCurrentLocation().availableHires.filter(adventurer => this.canHire(adventurer.name));
            };

            this.hireAll = function() {
                while (this.getAllHireableAdventurers().length > 0) {
                    this.hire(this.getAllHireableAdventurers()[0]);
                }
            };

            this.getHiredCount = function(name) {
                var hiredCount = this.hired[name];
                if (!hiredCount) hiredCount = 0;
                return hiredCount;
            };

            this.getAdventurersOnTheJob = function(name) {
                if (this.runningExpeditions === undefined || this.runningExpeditions.length === 0) return 0;
                var total = this.runningExpeditions.map(function(expedition) {
                    if (expedition.adventurers) return expedition.adventurers.filter(adventurer => adventurer.type == name).length;
                    return 0;
                }).reduce(function(accumulator, currentValue) {
                    return accumulator + currentValue;
                });
                return total;
            };

            this.spendHires = function(name, amount) {
                this.hired[name] = this.hired[name] - amount;
                this.trackStat("send-adventurer", name, amount);
                this.trackStat("send", "adventurers", amount);
            };

            this.getUpgrade = function(adventurerType) {
                var becomesList = this.getHireable(adventurerType).becomes;
                if (becomesList.length === 0) {
                    return null;
                }
                return becomesList[Math.floor(Math.random() * becomesList.length)];
            };
            this.getCost = function(name) {
                var hiredCount = this.getHiredCount(name);
                var hireable = this.getHireable(name);
                return this.getGlobalValue("hireCostModifier") * Math.floor(hireable.baseCost + hireable.costMultiplier * hiredCount + Math.pow(hireable.costExponent, hiredCount));
            };

            this.hire = function(hireable) {
                if (!this.canHire(hireable.name)) {
                    return;
                }
                var hiredCount = this.getHiredCount(hireable.name);
                var cost = this.getCost(hireable.name);
                this.spendCoins(cost);
                this.trackStat("spend-coins-on", hireable.name, cost);
                this.hired[hireable.name] = hiredCount + 1;

                this.LocationManager().getCurrentLocation().availableHires.splice(this.LocationManager().getCurrentLocation().availableHires.indexOf(hireable), 1);

                this.trackStat("hire", "adventurer", 1);
                this.trackStat("hire-adventurer", hireable.name, 1);
            };

            // Contracts

            this.viewContract = function(contract) {
                this.selectedContract = contract;
            };

            this.addNewContracts = function() {
                // New contracts
                var maxContracts = 5;
                if (this.LocationManager().getCurrentLocation().availableContracts.length < maxContracts && Math.random() < this.getGlobalValue("chanceOfNewContract")) {
                    this.addContract();
                }
            };

            this.addContract = function() {

                var location = this.LocationManager().getCurrentLocation();
                var locationContractsTypes = location.contracts;

                if (locationContractsTypes === undefined || locationContractsTypes.length === 0) { return; }

                var contractName = locationContractsTypes[Math.floor(locationContractsTypes.length * Math.random())];

                var contract = commonFunctions.clone(this.getContract(contractName));
                if (contract === undefined) {
                    console.log("Contract '" + contractName + "' is listed for location '" + location.name + "' but has no definition.");
                    return;
                }

                contract.expires = Date.now() + Math.floor(this.millisecondsPerSecond * this.getGlobalValue("averageJobContractExpiry") * (Math.random() + 0.5));

                this.LocationManager().getCurrentLocation().availableContracts.push(contract);

                this.LocationManager().getCurrentLocation().availableContracts.sort(function(a, b) {
                    return a.expires - b.expires;
                });
                this.trackStat("available-contract", contract.name, 1);
                this.trackStat("available", "contract", 1);
            };

            this.getContract = function(name) {
                return contracts.filter(contract => contract.name == name)[0];
            };

            this.get = function(type, name) {
                var item = data[type].filter(item => item.name == name)[0]
                if (item === undefined) {
                    item = { "name": "undefined" };
                }
                return item;
            };

            this.getIcon = function(iconFor) {
                switch (iconFor) {
                    case "coins":
                        return "./img/icons/crown-coin.png";
                    case "renown":
                        return "./img/icons/thumb-up.png";
                    case "item":
                        return "./img/icons/swap-bag.png";
                }

            };

            // Expediations

            this.claimAllCompletedExpeditions = function() {
                while (this.completedExpeditions.length > 0) {
                    if (this.completedExpeditions[0].success) {
                        this.claimReward(this.completedExpeditions[0]);
                    } else {
                        this.removeExpedition(this.completedExpeditions[0]);
                    }
                }
            };

            this.removeExpedition = function(expedition) {
                this.completedExpeditions.splice(this.completedExpeditions.indexOf(expedition), 1);
            };

            this.expeditionProgress = function(expedition) {
                return 100 * ((Date.now() - expedition.start) / (expedition.expires - expedition.start));
            };

            // Rewards
            this.giveRenown = function(amount) {
                $('#footerRenown').animateCss('bounce');
                this.trackStat("get", "renown", amount);
                this.renown += amount;
            };

            this.giveReward = function(reward) {
                switch (reward.type) {
                    case "coins":
                        this.giveCoins(reward.amount);
                        break;
                    case "reknown":
                    case "renown":
                        this.giveRenown(reward.amount);
                        break;
                    case "item":
                        this.ItemManager().giveItem(reward.item);
                        break;
                    default:
                        this.hired[type] += amount;
                }
            };

            this.claimReward = function(expedition) {
                this.trackStat("claim", "reward", 1);
                if (expedition.contract.contractAmount) {
                    this.giveCoins(expedition.contract.contractAmount);
                }
                for (var i = 0; i < expedition.rewards.length; i++) {
                    this.giveReward(expedition.rewards[i]);
                }
                this.removeExpedition(expedition);
            };

            // Other
            this.varyAmount = function(amount) {
                return Math.floor(amount * (Math.random() + 0.5));
            };



            this.readableTime = function(milliseconds) {

                var totalSeconds = Math.floor(milliseconds / 1000);
                var seconds = totalSeconds % 60;
                var totalMinutes = (totalSeconds - seconds) / 60;
                var minutes = totalMinutes % 60;
                var hours = (totalSeconds - (seconds + minutes * 60)) % 60;

                var timeString = "";
                if (hours) {
                    timeString += hours + "hr ";
                }
                if (minutes) {
                    timeString += minutes + "m ";
                }
                if (seconds) {
                    timeString += seconds + "s";
                }

                if (timeString.length === 0) {
                    timeString = "0s";
                }
                return timeString;
            };

            this.expiringSoon = function(date) {
                return date - Date.now() <= 5000;
            };

            this.expiringDanger = function(date) {
                return date - Date.now() <= 5000;
            };

            this.expiringWarning = function(date) {
                return !this.expiringDanger(date) && date - Date.now() <= 15000;
            };

            this.expiringSuccess = function(date) {
                return !this.expiringDanger(date) && !this.expiringWarning(date);
            };

            this.expireAllExpired = function() {

                // Remove completed effects
                for (var h = 0; h < this.currentEffects.length; h++) {
                    var effect = this.currentEffects[h];
                    if (this.currentEffects[h].expires === undefined || this.currentEffects[h].expires <= Date.now()) {
                        this.currentEffects.splice(h, 1);
                    }
                }
                // Check for completed expeditions
                for (var i = 0; i < this.runningExpeditions.length; i++) {
                    if (this.runningExpeditions[i].expires <= Date.now()) {
                        this.QuestManager().completeQuest(this.runningExpeditions[i]);
                    }
                }
                // Remove expired contracts
                var availableContracts = this.LocationManager().getCurrentLocation().availableContracts;
                if (availableContracts) {
                    for (var j = 0; j < availableContracts.length; j++) {
                        if (availableContracts[j].expires <= Date.now()) {
                            this.trackStat("miss", "contract", 1);
                            this.trackStat("miss-contract", availableContracts[j].name, 1);
                            if (this.selectedContract == availableContracts[j]) this.selectedContract = null;
                            availableContracts.splice(j, 1);
                        }
                    }
                }

                // Remove expired hired
                var availableAdventurers = this.LocationManager().getCurrentLocation().availableAdventurers;
                if (availableAdventurers) {
                    for (var k = 0; k < availableAdventurers.length; k++) {
                        if (availableAdventurers[k].expires <= Date.now()) {
                            this.trackStat("miss", "adventurer", 1);
                            this.trackStat("miss-adventurer", availableAdventurers[k].name, 1);
                            availableAdventurers.splice(k, 1);
                        }
                    }
                }

                for (var locationIndex = 0; locationIndex < this.allLocations.length; locationIndex++) {
                    var location = this.allLocations[locationIndex];

                    // Remove expired contracts
                    if (location.availableContracts) {
                        for (var m = 0; m < location.availableContracts.length; m++) {
                            if (location.availableContracts[m].expires <= Date.now()) {
                                this.trackStat("miss", "contract", 1);
                                this.trackStat("miss-contract", location.availableContracts[m].name, 1);
                                if (this.selectedContract == location.availableContracts[m]) this.selectedContract = null;
                                location.availableContracts.splice(m, 1);

                            }
                        }
                    }

                    // Remove expired hired
                    if (location.availableAdventurers) {
                        for (var k = 0; k < location.availableAdventurers.length; k++) {
                            if (location.availableAdventurers[k].expires <= Date.now()) {
                                this.trackStat("miss", "adventurer", 1);
                                this.trackStat("miss-adventurer", location.availableAdventurers[k].name, 1);
                                location.availableAdventurers.splice(k, 1);
                            }
                        }
                    }
                }
            };

            this.lessthan = function(a, b) {
                return a < b;
            };

            this.tick = function() {
                this.freeCoinsTimeout--;

                this.expireAllExpired();

                this.calculateCounter++;
                if (this.calculateCounter > 10) {
                    this.calculate();

                    if (this.options.automaticRelocate) {
                        if (this.LocationManager().canRelocateUp()) {
                            this.LocationManager().relocateUp();
                        }
                    }
                    if (this.options.automaticFreeCoins) {
                        if (this.canGetFreeCoins()) {
                            this.freeCoins(this.LocationManager().getCurrentLocation());
                        }
                    }
                    if (this.options.automaticClaim) {
                        this.claimAllCompletedExpeditions();
                    }
                    if (this.options.automaticHire) {
                        this.hireAll();
                    }
                    if (this.options.automaticSend) {
                        //this.startAllContracts();
                    }
                }
            };


            console.log("initialising");

            if (!saveData) {
                this.reset();
            } else {
                this.loadFromSavedData(saveData);
            }
            this.login();
            this.QuestManager().prepContractQueue(this.timeSinceLastLogin);
            this.AdventurerManager().prepAdventurersQueue(this.timeSinceLastLogin);

        };
    });