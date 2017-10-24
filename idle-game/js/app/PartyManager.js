define([
        "app/CommonFunctions",
        "app/DataManager",
        "app/GameStateManager"
    ],
    function PartyManager(
        CommonFunctions,
        DataManager) {

        common = new CommonFunctions();
        data = new DataManager();
        return function PartyManager(gameController) {

            this.gameController = gameController;
            this.gameState = gameController.gameState;

        };
    }
);