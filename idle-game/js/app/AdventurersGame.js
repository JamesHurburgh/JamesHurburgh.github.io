/*jshint esversion: 6 */

define(["jquery"],
    function AdventurersGame(jquery) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        var contractLocations = [{
                "name": "Dirty Alley",
                "statusRequired": 0
            },
            {
                "name": "Street Corner",
                "statusRequired": 10
            },
            {
                "name": "Tavern",
                "statusRequired": 100
            },
            {
                "name": "Adventurer's Guild",
                "statusRequired": 1000
            }
        ];

        var hireables = [{
            "name": "Drunkard",
            "plural": "Drunkards",
            "cpt": 0.1,
            "baseCost": 1,
            "costMultiplier": 1.5,
            "costExponent": 1.5
        }, {
            "name": "Street rat",
            "plural": "Street rats",
            "cpt": 0.2,
            "baseCost": 2,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Peasent",
            "plural": "Peasents",
            "cpt": 0.5,
            "baseCost": 10,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Adventurer",
            "plural": "Adventurers",
            "cpt": 1,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Barbarian",
            "plural": "Barbarians",
            "cpt": 1,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Archer",
            "plural": "Archers",
            "cpt": 1,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Seasoned veteran",
            "plural": "Seasoned veterans",
            "cpt": 5,
            "baseCost": 1000,
            "costMultiplier": 5,
            "costExponent": 1.5
        }];

        // Follow dubious treasure map (Low risk, low chance of big reward)
        // Rob some graves (Medium risk, high chance of medium reward)
        // Fight some bandits (High risk, high chance of big reward)
        var contracts = [{
            "name": "Follow a dubious treasure map",
            "risk": 1,
            "duration": 2000,
            "rewards": [{ "chance": 0.05, "reward": { "type": "coins", "amount": 1000 } }],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Drunkard", "amount": 2 }
                ]
            }
        }, {
            "name": "An honest days work",
            "risk": 0,
            "duration": 200,
            "rewards": [{ "chance": 1, "reward": { "type": "coins", "amount": 15 } }],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Peasent", "amount": 1 }
                ]
            }
        }, {
            "name": "Rob some graves",
            "risk": 5,
            "duration": 100,
            "rewards": [{ "chance": 0.9, "reward": { "type": "coins", "amount": 5 } }],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Drunkard", "amount": 1 }
                ]
            }
        }, {
            "name": "Mug a traveller",
            "risk": 5,
            "duration": 150,
            "rewards": [{ "chance": 0.5, "reward": { "type": "coins", "amount": 20 } }],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Street rat", "amount": 2 }
                ]
            }
        }, {
            "name": "Fight some bandits",
            "risk": 15,
            "duration": 500,
            "rewards": [{ "chance": 0.5, "reward": { "type": "coins", "amount": 1000 } }],
            "requirements": {
                "status": 1,
                "hireables": [
                    { "type": "Drunkard", "amount": 2 }
                ]
            }
        }, ];

        return function AdventurersGame(gameData, autoSaveFunction) {

            this.autoSave = autoSaveFunction;

            this.reset = function() {
                // Then initialise new
                this.calculateCounter = 0;

                this.coins = 10;
                this.coinsPerTick = 0;
                this.status = 0;

                this.hired = {};
                this.actualCpts = [];

                this.runningExpeditions = [];
                this.completedExpeditions = [];

                this.numberOfAdventurers = 0;
                this.numberOfAdvancedAdventurers = 0;
                this.coinsPerAdventurer = 1;
                this.calculate();
            };

            this.calculate = function() {
                // Do all calculations here
                this.calculateCounter = 0;
                console.log("calculating");
                // Autosave
                this.autoSave();

                // Resource Gathering
                this.coinsPerTick = 0;

                for (var i = 0; i < hireables.length; i++) {
                    this.coinsPerTick += this.getCPT(hireables[i].name);
                }

                // Expedition Progress
                this.expeditionProgressPerTick = 0;
                if (this.expedition) {
                    this.expeditionProgressPerTick += 1;
                }
            };

            this.updateGameData = function(gameData) {
                if (!this.calculateCounter) this.calculateCounter = 0;

                if (!this.coins) this.coins = 10;
                if (!this.coinsPerTick) this.coinsPerTick = 0;
                if (!this.status) this.status = 0;

                if (!this.hired) this.hired = {};

                if (!this.runningExpeditions) this.runningExpeditions = [];
                if (!this.completedExpeditions) this.completedExpeditions = [];

                if (!this.numberOfAdventurers) this.numberOfAdventurers = 0;
                if (!this.numberOfAdvancedAdventurers) this.numberOfAdvancedAdventurers = 0;
                if (!this.coinsPerAdventurer) this.coinsPerAdventurer = 1;
            };

            this.spendCoins = function(coins) {
                this.coins -= coins;
            };

            this.canHire = function(name) {
                return this.coins > this.getCost(name);
            };

            this.getHireable = function(name) {
                return hireables.filter(hireable => hireable.name == name)[0];
            };

            this.getHiredCount = function(name) {
                var hiredCount = this.hired[name];
                if (!hiredCount) hiredCount = 0;
                return hiredCount;
            };

            this.getTotalCPT = function() {

            };

            this.spendHires = function(name, amount) {
                this.hired[name] = this.hired[name] - amount;
                this.calculate();
            };

            this.getContract = function(name) {
                return this.contracts.filter(contract => contract.name == name)[0];
            };

            this.canSendExpedition = function(contract) {
                if (contract.requirements.hireables) {
                    for (var i = 0; i < contract.requirements.hireables.length; i++) {
                        if (contract.requirements.hireables[i].amount > this.getHiredCount(contract.requirements.hireables[i].type)) {
                            return false;
                        }
                    }
                }
                return this.status >= contract.requirements.status;
            };

            this.sendExpedition = function(contract) {
                if (contract.requirements.hireables) {
                    for (var i = 0; i < contract.requirements.hireables.length; i++) {
                        this.spendHires(contract.requirements.hireables[i].type, contract.requirements.hireables[i].amount);
                    }
                }
                this.runningExpeditions.push({
                    "id": uuidv4(),
                    "contract": contract,
                    "progress": 0
                });
            };

            this.giveCoins = function(amount) {
                this.coins += amount;
            };

            this.giveReward = function(type, amount) {
                if (type == "coins") {
                    this.giveCoins(amount);
                } else {
                    this.hired[type] += amount;
                }
            };

            this.claimReward = function(expedition) {
                for (var i = 0; i < expedition.rewards.length; i++) {
                    this.giveReward(expedition.rewards[i].type, expedition.rewards[i].amount);
                }
                this.completedExpeditions.splice(this.completedExpeditions.indexOf(expedition), 1);
            };

            this.completeExpedition = function(expedition) {
                this.runningExpeditions.splice(this.runningExpeditions.indexOf(expedition), 1);
                expedition.rewards = [];
                for (var i = 0; i < expedition.contract.rewards.length; i++) {
                    var chance = expedition.contract.rewards[i].chance;
                    if (Math.random() < chance) {
                        var reward = expedition.contract.rewards[i].reward;
                        var variation = Math.random() + 0.5;
                        expedition.rewards.push({ "type": reward.type, "amount": Math.floor(reward.amount * variation) });
                    }
                }
                this.completedExpeditions.push(expedition);
            };

            this.getCPT = function(name) {
                var hireable = this.getHireable(name);
                var hiredCount = this.getHiredCount(name);
                return Math.floor(hiredCount * hireable.cpt);
            };

            this.getCost = function(name) {
                var hiredCount = this.getHiredCount(name);
                var hireable = this.getHireable(name);
                return Math.floor(hireable.baseCost + hireable.costMultiplier * hiredCount + Math.pow(hireable.costExponent, hiredCount));
            };

            this.hire = function(name) {
                var hiredCount = this.getHiredCount(name);

                this.spendCoins(this.getCost(name));
                this.hired[name] = hiredCount + 1;

                this.calculate();
            };

            this.tick = function() {
                // Do all task completion here

                this.coins += this.coinsPerTick;

                for (var i = 0; i < this.runningExpeditions.length; i++) {
                    if (this.runningExpeditions[i].progress >= this.runningExpeditions[i].contract.duration) {
                        this.completeExpedition(this.runningExpeditions[i]);
                    } else {
                        this.runningExpeditions[i].progress++;
                    }
                }

                this.calculateCounter++;
                if (this.calculateCounter > 10) {
                    this.calculate();
                }
            };

            if (!gameData) {
                this.reset();
            }
            this.updateGameData(gameData);
            $.extend(this, gameData);


            this.hireables = hireables;
            this.contracts = contracts;

            this.calculate();

        };
    });