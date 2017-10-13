/*jshint esversion: 6 */

/*

1. Rename file and CLASS_NAME to Manager name.
2. Paste the following into AdventureGame:

            _CLASS_NAME = new CLASS_NAME(this);
            this.CLASS_NAME = function() {
                return _CLASS_NAME;
            };
3. Delete this comment block.

*/

define([
    "app/CommonFunctions",
    "app/DataManager"],
    function CLASS_NAME(
        CommonFunctions,
        DataManager) {

        common = new CommonFunctions();
        data = new DataManager();
        return function CLASS_NAME(gameState) {

            this.gameState = gameState;

        };
    }
);