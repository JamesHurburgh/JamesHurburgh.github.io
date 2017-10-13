/*jshint esversion: 6 */

define([
    "app/CommonFunctions",
    "app/DataManager"],
    function OptionsManager(
        CommonFunctions,
        DataManager) {

        common = new CommonFunctions();
        data = new DataManager();
        return function OptionsManager(gameController) {

            this.gameController = gameController;
            this.gameState = gameController.gameState;

            // Options
            this.cheat = function () {
                log("cheat");
                this.gameController.PlayerManager().giveCoins(100000000000);
                this.gameController.PlayerManager().giveRenown(100000000000);
            };

            this.getOptions = function () {
                if (!this.gameState.options) this.gameState.options = {};
                return this.gameState.options;
            };

        };
    }
);