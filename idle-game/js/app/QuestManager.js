/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "json!data/contracts.json"
    ],
    function QuestManager(
        CommonFunctions,
        contracts) {

        commonFunctions = new CommonFunctions();
        chance = new Chance();
        return function QuestManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getCompletedQuests = function() {
                if (!this.gameState.completedQuests) this.gameState.completedQuests = [];
                return this.gameState.completedQuests;
            };

            this.getRunningQuests = function() {
                if (!this.gameState.runningQuests) this.gameState.runningQuests = [];
                return this.gameState.runningQuests;
            };

            this.showQuestsTab = function() {
                return this.getCompletedQuests().length + this.getRunningQuests().length !== 0;
            };

            this.getSelectedContract = function() {
                return this.gameState.selectedContract;
            };

            this.selectNextContract = function() {
                var availableContracts = this.gameController.LocationManager().getCurrentLocation().availableContracts;
                var selectedContract = this.getSelectedContract();
                var index = 0;
                if (selectedContract) {
                    index = (availableContracts.indexOf(selectedContract) + 1) % availableContracts.length;
                }
                this.gameState.selectedContract = availableContracts[index];
            };

            this.canSendSelectedQuest = function() {
                return this.canSendQuest(this.getSelectedContract());
            };

            this.isSkillRelevantToContract = function(skill, contract) {
                if (!skill || !contract) return false;
                var skillRequiredForContract = contract.requirements.attributes.filter(sk => sk.type == skill.name)[0];
                return skillRequiredForContract !== undefined && skillRequiredForContract.amount > 0;
            }

            this.rejectSelectedContract = function() {
                this.rejectContract(this.getSelectedContract());
                this.gameState.selectedContract = null;
                this.selectNextContract();
            };

            this.rejectContract = function(contract) {
                var availableContracts = this.gameController.LocationManager().getCurrentLocation().availableContracts;
                availableContracts.splice(availableContracts.indexOf(contract), 1);
            };

            this.canSendQuest = function(contract) {
                if (!contract) return;
                var adventurerManager = this.gameController.AdventurerManager();
                return contract.requirements.attributes.reduce(function(canSend, skillRequirement) {
                    return canSend && adventurerManager.getCurrentPartyAttribute(skillRequirement.type) >= skillRequirement.amount;
                }, true);
            };

            this.getCurrentQuestRequiredAndAssignedSkillCount = function(skillName) {
                return this.getRequiredAndAssignedSkillCount(this.getSelectedContract(), skillName);
            };

            this.getRequiredAndAssignedSkillCount = function(contract, skillName) {
                if (!contract || !skillName) return;
                var currentlyAssigned = this.gameController.AdventurerManager().getCurrentPartyAttribute(skillName);
                if (currentlyAssigned === 0) return 0;
                var requiredSkill = contract.requirements.attributes.filter(skill => skill.type == skillName)[0];
                if (!requiredSkill) {
                    return 0;
                }
                return Math.min(currentlyAssigned, requiredSkill.amount);
            };

            this.getCurrentQuestRequiredAndUnassignedSkillCount = function(skillName) {
                return this.getRequiredAndUnassignedSkillCount(this.getSelectedContract(), skillName);
            };

            this.getRequiredAndUnassignedSkillCount = function(contract, skillName) {
                var currentlyAssigned = this.gameController.AdventurerManager().getCurrentPartyAttribute(skillName);
                var requiredSkill = contract.requirements.attributes.filter(skill => skill.type == skillName)[0];
                if (!requiredSkill) return 0;
                return Math.max(requiredSkill.amount - currentlyAssigned, 0);
            };

            this.sendSelectedQuest = function() {
                this.sendQuest(this.getSelectedContract());
                this.selectNextContract();
            };

            this.sendQuest = function(contract) {
                if (!this.canSendQuest(contract)) {
                    return;
                }

                this.gameController.StatisticsManager().trackStat("send", "quest", 1);
                this.gameController.StatisticsManager().trackStat("send-quest", contract.name, 1);

                var quest = {
                    id: commonFunctions.uuidv4(),
                    contract: contract,
                    start: Date.now(),
                    expires: Date.now() + (contract.duration * 1000),
                    party: this.gameController.AdventurerManager().getCurrentParty()
                };

                this.gameController.AdventurerManager().sendCurrentParty();

                this.getRunningQuests().push(quest);

                this.getRunningQuests().sort(function(a, b) {
                    return a.expires - b.expires;
                });

                var availableContracts = this.gameController.LocationManager().getCurrentLocation().availableContracts;
                availableContracts.splice(availableContracts.indexOf(contract), 1);
                this.gameState.selectedContract = null;
            };

            this.completeQuest = function(quest) {
                this.getRunningQuests().splice(this.getRunningQuests().indexOf(quest), 1);

                var contract = quest.contract;

                this.gameController.StatisticsManager().trackStat("complete", "quest", 1);
                this.gameController.StatisticsManager().trackStat("complete-quest", contract.name, 1);

                // Return questers to sendable pool
                quest.upgradeMessages = "";
                quest.awol = false;
                quest.survivors = [];
                quest.casualaties = [];

                if (quest.party) {
                    quest.party.forEach(function(adventurer) {
                        // Did they die?
                        if (Math.random() * this.gameController.EffectsManager().getGlobalValue("questRisk") < contract.risk) {
                            adventurer.status = "Dead";
                            this.gameController.StatisticsManager().trackStat("death", "adventurer", 1);
                            quest.casualaties.push(adventurer);

                            // gameState.StatisticsManager().trackStat("death-adventurer", adventurer.type, 1);
                        } else {
                            // if (Math.random() * gameState.EffectsManager().getGlobalValue("upgradeChance") < contract.upgradeChance) { // Then someone 'upgraded'
                            //     gameState.AdventurerManager().upgradeAdventurer(adventurer);
                            //     // TODO handle upgrades
                            // }
                            adventurer.status = "Idle";
                            adventurer.experience++;
                            quest.survivors.push(adventurer);
                        }
                    }, this);
                }

                if (quest.contract.experience > 0 && quest.survivors.length > 0) {
                    var xpEach = Math.ceil(quest.experience / survived);
                    quest.survivors.foreach(function(adventurer) {
                        adventurer.experience += xpEach;
                    });
                }

                quest.completionMessage = "";

                // Calculate success
                quest.success = quest.survivors.length > 0 && Math.random() < contract.successChance;
                if (quest.success) {
                    quest.completionMessage = contract.successMessage;

                    quest.rewards = [];
                    for (var j = 0; j < contract.rewards.length; j++) {
                        var chance = contract.rewards[j].chance;
                        if (Math.random() < chance) {
                            var reward = contract.rewards[j].reward;
                            if (reward.type == "item") {
                                quest.rewards.push({ "type": reward.type, "item": this.gameController.ItemManager().generateRewardItem(reward) });
                            } else {
                                var rewardAmount = commonFunctions.varyAmount(reward.amount);
                                if (rewardAmount > 0) {
                                    quest.rewards.push({ "type": reward.type, "amount": rewardAmount });
                                }
                            }
                        }
                    }
                    this.gameController.StatisticsManager().trackStat("succeed", "quest", 1);
                    this.gameController.StatisticsManager().trackStat("succeed-quest", contract.name, 1);
                } else {
                    quest.completionMessage = contract.failureMessage;
                    this.gameController.StatisticsManager().trackStat("fail", "quest", 1);
                    this.gameController.StatisticsManager().trackStat("fail-quest", contract.name, 1);
                }

                this.getCompletedQuests().push(quest);
            };

            this.claimReward = function(expedition) {
                this.gameController.StatisticsManager().trackStat("claim", "reward", 1);
                if (expedition.contract.contractAmount) {
                    this.gameController.PlayerManager().giveCoins(expedition.contract.contractAmount);
                }
                for (var i = 0; i < expedition.rewards.length; i++) {
                    this.gameController.PlayerManager().giveReward(expedition.rewards[i]);
                }
                this.removeQuest(expedition);
            };


            // Expediations

            this.claimAllCompletedQuests = function() {
                // while (this.completedExpeditions.length > 0) {
                //     if (this.completedExpeditions[0].success) {
                //         this.claimReward(this.completedExpeditions[0]);
                //     } else {
                //         this.removeQuest(this.completedExpeditions[0]);
                //     }
                // }
            };

            this.removeQuest = function(expedition) {
                this.getCompletedQuests().splice(this.getCompletedQuests().indexOf(expedition), 1);
            };

            this.questProgress = function(expedition) {
                return 100 * ((Date.now() - expedition.start) / (expedition.expires - expedition.start));
            };

            this.checkForCompletedQuests = function() {

                var expired = this.getRunningQuests().filter(quest => quest.expires <= Date.now());

                for (var i = 0; i < expired.length; i++) {
                    this.completeQuest(expired[i]);
                }
            };

        };
    }
);