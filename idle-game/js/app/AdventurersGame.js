/*jshint esversion: 6 */

define(["jquery", "json!data/contracts.json", "json!data/locations.json", "json!data/adventurers.json"],
    function AdventurersGame(jquery, contracts, locations, adventurers) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function clone(object) {
            return JSON.parse(JSON.stringify(object));
        }

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

                for (var i = 0; i < adventurers.length; i++) {
                    this.coinsPerTick += this.getCPT(adventurers[i].name);
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

                var maxAvailableHires = 5;
                // New hires
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
                return adventurers.filter(hireable => hireable.name == name)[0];
            };

            this.getHiredCount = function(name) {
                var hiredCount = this.hired[name];
                if (!hiredCount) hiredCount = 0;
                return hiredCount;
            };

            this.addAvailableHire = function() {
                var locationHireables = this.adventurers.filter(hireable => this.location.adventurers.indexOf(hireable.name) >= 0);
                var hireable = clone(locationHireables[Math.floor(locationHireables.length * Math.random())]);
                hireable.expires = Date.now() + Math.floor(60000 * (Math.random() + 0.5));
                this.availableHires.push(hireable);
                this.availableHires.sort(function(a, b) {
                    return a.expires > b.expires;
                });
            };

            this.spendHires = function(name, amount) {
                this.hired[name] = this.hired[name] - amount;
                this.calculate();
            };

            this.addContract = function() {
                var locationContracts = this.contracts.filter(contract => this.location.contracts.indexOf(contract.name) >= 0);
                var contract = clone(locationContracts[Math.floor(locationContracts.length * Math.random())]);
                contract.expires = Date.now() + Math.floor(60000 * (Math.random() + 0.5));
                this.availableContracts.push(contract);
                this.availableContracts.sort(function(a, b) {
                    return a.expires > b.expires;
                });
            };

            this.getContract = function(name) {
                return this.contracts.filter(contract => contract.name == name)[0];
            };

            this.canSendExpedition = function(contract) {
                if (contract.requirements.adventurers) {
                    for (var i = 0; i < contract.requirements.adventurers.length; i++) {
                        if (contract.requirements.adventurers[i].amount > this.getHiredCount(contract.requirements.adventurers[i].type)) {
                            return false;
                        }
                    }
                }
                return this.status >= contract.requirements.status;
            };

            this.sendExpedition = function(contract) {
                if (contract.requirements.adventurers) {
                    for (var i = 0; i < contract.requirements.adventurers.length; i++) {
                        this.spendHires(contract.requirements.adventurers[i].type, contract.requirements.adventurers[i].amount);
                    }
                }
                this.runningExpeditions.push({
                    "id": uuidv4(),
                    "contract": contract,
                    "expires": Date.now() + (contract.duration * 1000)
                });

                this.runningExpeditions = this.runningExpeditions.sort(function(a, b) {
                    return a.expires > b.expires;
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
                if (contract.requirements.adventurers) {
                    for (var i = 0; i < contract.requirements.adventurers.length; i++) {
                        this.hired[contract.requirements.adventurers[i].type] += contract.requirements.adventurers[i].amount;
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
                if (!this.canHire(hireable.name)) {
                    return;
                }
                var hiredCount = this.getHiredCount(hireable.name);

                this.spendCoins(this.getCost(hireable.name));
                this.hired[hireable.name] = hiredCount + 1;

                this.availableHires.splice(this.availableHires.indexOf(hireable), 1);

                this.calculate();
            };

            this.readableTime = function(milliseconds) {

                var totalSeconds = Math.floor(milliseconds / 1000);
                var seconds = totalSeconds % 60;
                var totalMinutes = (totalSeconds - seconds) / 60;
                var minutes = totalMinutes % 60;
                var hours = (totalSeconds - (seconds + minutes * 60)) % 60;

                var timeString = "";
                if (hours) {
                    timeString += hours + " hours ";
                }
                if (minutes) {
                    timeString += minutes + " minutes ";
                }
                if (seconds) {
                    timeString += seconds + " seconds";
                }
                return timeString;
            };

            this.expiringSoon = function(date) {
                return date - Date.now() < 5000;
            };

            this.tick = function() {
                // Do all task completion here

                this.coins += this.coinsPerTick;
                this.freeCoinsTimeout--;

                for (var i = 0; i < this.runningExpeditions.length; i++) {
                    if (this.runningExpeditions[i].expires <= Date.now()) {
                        this.completeExpedition(this.runningExpeditions[i]);
                    }
                }

                for (var j = 0; j < this.availableContracts.length; j++) {
                    if (this.availableContracts[j].expires <= Date.now()) {
                        this.availableContracts.splice(j, 1);
                    }
                }
                // Remove expired hired
                for (var k = 0; k < this.availableHires.length; k++) {
                    if (this.availableHires[k].expires <= Date.now()) {
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


            this.adventurers = adventurers;
            this.contracts = contracts;
            this.locations = locations;

            this.calculate();

        };
    });