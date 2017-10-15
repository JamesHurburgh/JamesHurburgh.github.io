/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "app/DataManager"
    ],
    function PlayerManager(
        CommonFunctions,
        DataManager) {

        common = new CommonFunctions();
        data = new DataManager();

        return function PlayerManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            // Renown
            this.getRenownValue = function() {
                if (!this.gameState.renown) this.gameState.renown = 0;
                return this.gameState.renown;
            };

            this.getRenown = function() {
                return data.renown.filter(r => r.minimum <= this.getRenownValue() && r.maximum > this.getRenownValue())[0];
            };

            this.getCoins = function() {
                if (this.gameState.coins === undefined || this.gameState.coins === null) this.gameState.coins = 50;
                return this.gameState.coins;
            };

            this.giveRenown = function(amount) {
                $('#footerRenown').animateCss('bounce');
                this.gameController.StatisticsManager().trackStat("get", "renown", amount);
                this.gameState.renown = this.getRenownValue() + amount;
            };

            // Coins
            this.giveCoins = function(amount) {
                $('#footerCoin').animateCss('bounce');
                this.gameController.StatisticsManager().trackStat("get", "coins", amount);
                this.gameState.coins += amount;
            };

            this.spendCoins = function(coins) {
                this.gameState.coins -= coins;
                this.gameController.StatisticsManager().trackStat("spend", "coins", coins);
            };

            // Rewards
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
                        this.gameController.ItemManager().giveItem(reward.item);
                        break;
                    default:
                }
            };

        };
    }
);