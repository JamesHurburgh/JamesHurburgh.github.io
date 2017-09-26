/*jshint esversion: 6 */

define(["json!data/items.json"],
    function AdventurersGame(
        items) {

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
        };

        return function ItemManager(gameState) {

            this.gameState = gameState;

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