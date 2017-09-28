/*jshint esversion: 6 */

define(["json!data/items.json"],
    function ItemManager(items) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function clone(object) {
            try {
                return JSON.parse(JSON.stringify(object));
            } catch (exception) {
                console.log("Unable to parse object: " + JSON.stringify(object));
            }
        }

        function varyAmount(amount) {
            return Math.floor(amount * (Math.random() + 0.5));
        }

        return function ItemManager(gameState) {

            this.gameState = gameState;

            this.itemFunctions = [];
            this.itemFunctions["use-minor-mysterious-scroll"] = function(game) {
                var effects = [{
                        "description": "Suddenly your purse seems heavier.",
                        "effect": function(game) {
                            game.giveCoins(1000);
                        }
                    },
                    {
                        "description": "Suddenly every seems to have a job for you.",
                        "effect": function(game) {
                            game.addEffect("chanceOfNewContract", 2, Date.now() + 60000);
                        }
                    },
                    {
                        "description": "Suddenly every seems to want to work for you.",
                        "effect": function(game) {
                            game.addEffect("chanceOfNewHire", 2, Date.now() + 60000);
                        }
                    },
                    {
                        "description": "Suddenly every seems to be willing to work for much less.",
                        "effect": function(game) {
                            game.addEffect("hireCostModifier", 2, Date.now() + 60000);
                        }
                    },
                    {
                        "description": "Suddenly it seems like there are lots more coins around for the taking.",
                        "effect": function(game) {
                            game.addEffect("freeCoinsModifier", 10, Date.now() + 60000);
                        }
                    },
                    {
                        "description": "Suddenly it seems like everyone on quests are a lot safer.",
                        "effect": function(game) {
                            game.addEffect("questRisk", 0.1, Date.now() + 60000);
                        }
                    },
                    {
                        "description": "Suddenly it seems like everyone on quests are learning new things.",
                        "effect": function(game) {
                            game.addEffect("upgradeChance", 5, Date.now() + 60000);
                        }
                    }
                ];

                var effect = effects[Math.floor(Math.random() * effects.length)];
                game.message("You read a mysterious scroll. " + effect.description);
                effect.effect(game);
            };
            this.itemFunctions["use-mysterious-scroll"] = this.itemFunctions["use-minor-mysterious-scroll"];

            this.canSell = function(item) {
                return item.value !== undefined && item.value > 0;
            };

            this.sellItem = function(item) {
                if (!this.canSell(item)) {
                    return;
                }
                gameState.trackStat("sell", "item", 1);
                gameState.trackStat("sell-item", item.name, 1);
                gameState.giveCoins(item.value);
                this.removeItem(item);

            };

            this.canUse = function(item) {
                if (item.usage !== undefined) {
                    return true;
                }
            };

            this.removeItem = function(item) {
                gameState.ownedItems.splice(gameState.ownedItems.indexOf(item), 1);
            };

            this.useItem = function(item) {
                if (!this.canUse(item)) {
                    return;
                }

                var usageFunction = this.itemFunctions[item.usage];
                if (!usageFunction) {
                    return;
                }

                usageFunction(gameState);
                this.removeItem(item);
            };

            this.giveItem = function(item) {
                gameState.ownedItems.push(item);
                gameState.trackStat("collect", "item", 1);
                gameState.trackStat("collect-item", item.name, 1);
            };

            this.generateRewardItem = function(reward) {
                return this.generateItem(reward.itemType, reward.value);
            };

            this.getItemDefinition = function(itemType) {
                return items.filter(item => item.type == itemType)[0];
            };

            this.generateItem = function(itemType, value) {
                var itemDefinition = this.getItemDefinition(itemType);
                if (itemDefinition === undefined) {
                    return { "name": itemType, "value": varyAmount(value) };
                }
                // Check for subsets first
                if (itemDefinition.subsets !== undefined) {
                    var subset = itemDefinition.subsets[Math.floor(Math.random() * itemDefinition.subsets.length)];
                    return this.generateItem(subset, value);
                }

                var item = { "name": itemDefinition.displayName, "usage": itemDefinition.usage, "value": itemDefinition.baseValue };

                if (itemDefinition.prefixesList !== undefined) {
                    for (var i = 0; i < itemDefinition.prefixesList.length; i++) {
                        var prefix = itemDefinition.prefixesList[i][Math.floor(Math.random() * itemDefinition.prefixesList[i].length + 1)];
                        if (prefix !== undefined) {
                            item.name = prefix.prefix + " " + item.name;
                            item.value *= prefix.valueModifier;
                        }
                    }
                }
                item.value = Math.floor(item.value);

                return item;
            };
        };
    }
);