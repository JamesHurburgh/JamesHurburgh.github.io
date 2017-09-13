/*jshint esversion: 6 */

define(["jquery"],
    function AdventurersGame(jquery) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        var locations = [{
                "name": "Dirty Alley",
                "description": "The only thing here filthier than the alley are the people that inhabit it.  Drunks, theives and those down on their luck can be found here as well as work for those who don't mind getting their hands... even dirtier.",
                "statusRequired": 0,
                "freeCoinsDescription": "Scrounge in the dirt for a coin",
                "freeCoins": 1,
                "freeCoinsTimeout": 10,
                "contracts": ["Rob some graves", "Mug a traveller", "Follow a dubious treasure map", "An honest days work", "Tail a mark", "Start a brawl"],
                "hireables": ["Drunkard", "Street rat", "Peasant"]
            },
            {
                "name": "Street Corner",
                "description": "Officially, conducting business on the street corner is illegal.  But if you grease the palms of a guard or two and don't cause trouble, you can hire the locals and passerbys looking for work.  The townsfolk may also come to you to get things done.  Most of it legitimate, some of it, not so much.",
                "statusRequired": 10,
                "contracts": [],
                "hireables": []
            },
            {
                "name": "Tavern",
                "description": "You've reached the pinnacle of the underworld.  Sitting at a table in the local Tavern the oppressed and needy now know to come to you with their problems or 'business ventures'.",
                "statusRequired": 100,
                "contracts": [],
                "hireables": []
            },
            {
                "name": "Adventurer's Guild",
                "description": "",
                "statusRequired": 1000,
                "contracts": [],
                "hireables": []
            },
            {
                "name": "Mayor's Office",
                "description": "",
                "statusRequired": 10000,
                "contracts": [],
                "hireables": []
            },
            {
                "name": "Royal Antechamber",
                "description": "",
                "statusRequired": 100000,
                "contracts": [],
                "hireables": []
            },
            {
                "name": "Throne Room",
                "description": "",
                "statusRequired": 1000000,
                "contracts": [],
                "hireables": []
            }
        ];

        var hireables = [{
            "name": "Drunkard",
            "plural": "Drunkards",
            "cpt": 0,
            "baseCost": 1,
            "costMultiplier": 1.5,
            "costExponent": 1.5
        }, {
            "name": "Street rat",
            "plural": "Street rats",
            "cpt": 0,
            "baseCost": 2,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Peasant",
            "plural": "Peasants",
            "cpt": 0,
            "baseCost": 10,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Adventurer",
            "plural": "Adventurers",
            "cpt": 0,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Barbarian",
            "plural": "Barbarians",
            "cpt": 0,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Archer",
            "plural": "Archers",
            "cpt": 0,
            "baseCost": 100,
            "costMultiplier": 5,
            "costExponent": 1.5
        }, {
            "name": "Seasoned veteran",
            "plural": "Seasoned veterans",
            "cpt": 0,
            "baseCost": 1000,
            "costMultiplier": 5,
            "costExponent": 1.5
        }];

        var contracts = [{
            "name": "Follow a dubious treasure map",
            "risk": 1,
            "duration": 2000,
            "successChance": 0.05,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 1000 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
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
            "successChance": 1,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 15 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Peasant", "amount": 1 }
                ]
            }
        }, {
            "name": "Rob some graves",
            "risk": 5,
            "duration": 100,
            "successChance": 0.9,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 5 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
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
            "successChance": 0.5,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 20 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Street rat", "amount": 2 }
                ]
            }
        }, {
            "name": "Tail a mark",
            "risk": 5,
            "duration": 550,
            "successChance": 0.9,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 75 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Street rat", "amount": 1 }
                ]
            }
        }, {
            "name": "Start a brawl",
            "risk": 10,
            "duration": 350,
            "successChance": 0.8,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 750 } },
                { "chance": 1, "reward": { "type": "status", "amount": 1 } }
            ],
            "requirements": {
                "status": 0,
                "hireables": [
                    { "type": "Drunkard", "amount": 10 }
                ]
            }
        }, {
            "name": "Fight some bandits",
            "risk": 15,
            "duration": 500,
            "successChance": 0.5,
            "rewards": [
                { "chance": 1, "reward": { "type": "coins", "amount": 1000 } },
                { "chance": 1, "reward": { "type": "status", "amount": 2 } }
            ],
            "requirements": {
                "status": 1,
                "hireables": [
                    { "type": "Drunkard", "amount": 5 },
                    { "type": "Street rat", "amount": 10 },
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
                this.freeCoinsTimeout = 0;

                this.hired = {};
                this.actualCpts = [];

                this.runningExpeditions = [];
                this.completedExpeditions = [];

                this.availableContracts = [];
                this.availableHires = [];

                this.location = locations[0];

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

                // New contracts
                var maxContracts = 5;
                if (this.availableContracts.length < maxContracts && Math.random() > 0.85) {
                    this.addContract();
                }

                // New hires
                var maxAvailableHires = 5;
                if (this.availableHires.length < maxAvailableHires && Math.random() > 0.75) {
                    this.addAvailableHire();
                }

            };

            this.updateGameData = function(gameData) {
                if (!this.calculateCounter) this.calculateCounter = 0;

                if (!this.coins) this.coins = 10;
                if (!this.coinsPerTick) this.coinsPerTick = 0;
                if (!this.status) this.status = 0;
                if (!this.freeCoinsTimeout) this.freeCoinsTimeout = 0;

                if (!this.hired) this.hired = {};

                if (!this.runningExpeditions) this.runningExpeditions = [];
                if (!this.completedExpeditions) this.completedExpeditions = [];

                if (!this.availableContracts) this.availableContracts = [];
                if (!this.availableHires) this.availableHires = [];

                this.location = locations[0];
            };

            this.canGetFreeCoins = function() {
                return this.freeCoinsTimeout <= 0;
            };

            this.freeCoins = function(location) {
                this.giveCoins(location.freeCoins);
                this.freeCoinsTimeout = location.freeCoinsTimeout;
            };

            this.spendCoins = function(coins) {
                this.coins -= coins;
            };

            this.canHire = function(name) {
                return this.coins >= this.getCost(name);
            };

            this.getHireable = function(name) {
                return hireables.filter(hireable => hireable.name == name)[0];
            };

            this.getHiredCount = function(name) {
                var hiredCount = this.hired[name];
                if (!hiredCount) hiredCount = 0;
                return hiredCount;
            };

            this.addAvailableHire = function() {
                var locationHireables = this.hireables.filter(hireable => this.location.hireables.indexOf(hireable.name) >= 0);
                var hireable = locationHireables[Math.floor(locationHireables.length * Math.random())];
                hireable.timeLeft = Math.floor(60 * (Math.random() + 0.5));
                this.availableHires.push(hireable);
            };

            this.spendHires = function(name, amount) {
                this.hired[name] = this.hired[name] - amount;
                this.calculate();
            };

            this.addContract = function() {
                var locationContracts = this.contracts.filter(contract => this.location.contracts.indexOf(contract.name) >= 0);
                var contract = locationContracts[Math.floor(locationContracts.length * Math.random())];
                contract.timeLeft = Math.floor(60 * (Math.random() + 0.5));
                this.availableContracts.push(contract);
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
                this.availableContracts.splice(this.availableContracts.indexOf(contract), 1);
            };

            this.giveCoins = function(amount) {
                this.coins += amount;
            };

            this.giveStatus = function(amount) {
                this.status += amount;
            };

            this.giveReward = function(type, amount) {
                switch (type) {
                    case "coins":
                        this.giveCoins(amount);
                        break;
                    case "status":
                        this.giveStatus(amount);
                        break;
                    default:
                        this.hired[type] += amount;
                }
            };

            this.claimReward = function(expedition) {
                for (var i = 0; i < expedition.rewards.length; i++) {
                    this.giveReward(expedition.rewards[i].type, expedition.rewards[i].amount);
                }
                this.removeExpedition(expedition);
            };

            this.removeExpedition = function(expedition) {
                this.completedExpeditions.splice(this.completedExpeditions.indexOf(expedition), 1);
            };

            this.completeExpedition = function(expedition) {
                this.runningExpeditions.splice(this.runningExpeditions.indexOf(expedition), 1);

                var contract = expedition.contract;
                // Calculate success
                expedition.success = Math.random() < contract.successChance;
                if (expedition.success) {
                    expedition.rewards = [];
                    for (var i = 0; i < contract.rewards.length; i++) {
                        var chance = contract.rewards[i].chance;
                        if (Math.random() < chance) {
                            var reward = contract.rewards[i].reward;
                            var variation = Math.random() + 0.5;
                            expedition.rewards.push({ "type": reward.type, "amount": Math.floor(reward.amount * variation) });
                        }
                    }
                }

                // Return questers to sendable pool
                // TODO assess risk and kill some questers
                if (contract.requirements.hireables) {
                    for (var i = 0; i < contract.requirements.hireables.length; i++) {
                        this.hired[contract.requirements.hireables[i].type] += contract.requirements.hireables[i].amount;
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

            this.hire = function(hireable) {
                var hiredCount = this.getHiredCount(hireable.name);

                this.spendCoins(this.getCost(hireable.name));
                this.hired[hireable.name] = hiredCount + 1;

                this.availableHires.splice(this.availableHires.indexOf(hireable), 1);

                this.calculate();
            };

            this.tick = function() {
                // Do all task completion here

                this.coins += this.coinsPerTick;
                this.freeCoinsTimeout--;

                for (var i = 0; i < this.runningExpeditions.length; i++) {
                    if (this.runningExpeditions[i].progress >= this.runningExpeditions[i].contract.duration) {
                        this.completeExpedition(this.runningExpeditions[i]);
                    } else {
                        this.runningExpeditions[i].progress++;
                    }
                }

                for (var j = 0; j < this.availableContracts.length; j++) {
                    this.availableContracts[j].timeLeft -= 0.1;
                    if (this.availableContracts[j].timeLeft <= 0) {
                        this.availableContracts.splice(j, 1);
                    }
                }

                for (var k = 0; k < this.availableHires.length; k++) {
                    this.availableHires[k].timeLeft -= 0.1;
                    if (this.availableHires[k].timeLeft <= 0) {
                        this.availableHires.splice(k, 1);
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
            this.locations = locations;

            this.calculate();

        };
    });