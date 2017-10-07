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

define(["app/common","json!data/DATA_FILE.json"],
    function CLASS_NAME(common, DATA_FILE) {

        return function CLASS_NAME(gameState) {

            this.gameState = gameState;

        }
    }
);