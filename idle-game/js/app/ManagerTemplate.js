/*jshint esversion: 6 */

/*

1. Rename file and CLASS_NAME to Manager name.
2. Update the DATA_FILE variable.
3. Paste the following into AdventureGame:

            _CLASS_NAME = new CLASS_NAME(this);
            this.CLASS_NAME = function() {
                return _CLASS_NAME;
            };
4. Delete this comment block.

*/

define([
    "app/CommonFunctions",
    "json!data/DATA_FILE.json"],
    function CLASS_NAME(CommonFunctions, DATA_FILE) {

        commonFunctions = new CommonFunctions();

        return function CLASS_NAME(gameState) {

            this.gameState = gameState;

        };
    }
);