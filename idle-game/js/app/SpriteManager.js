/*jshint esversion: 6 */

/*

1. Rename file and SpriteManager to Manager name.
2. Paste the following into AdventureGame:

3. Delete this comment block.

*/

define([
        "app/CommonFunctions",
        "app/DataManager"
    ],
    function SpriteManager(
        CommonFunctions,
        DataManager) {

        common = new CommonFunctions();
        data = new DataManager();
        return function SpriteManager(gameState) {

            this.gameState = gameState;

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

        };
    }
);