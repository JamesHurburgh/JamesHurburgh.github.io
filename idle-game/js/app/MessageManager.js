/*jshint esversion: 6 */

/*

1. Rename file and MessageManager to Manager name.
2. Update the DATA_FILE variable.
3. Paste the following into AdventureGame:

4. Delete this comment block.

*/

define([
    "alertify",
    "app/CommonFunctions"
    ],
    function MessageManager(
        alertify,
        CommonFunctions) {

        commonFunctions = new CommonFunctions();

        return function MessageManager(gameState) {

            this.gameState = gameState;
            
            this.showMessageTab = function(){
                return gameState.messages.length !== 0;
            };

            this.recentMessages = function() {
                return gameState.messages.filter(message => message.time + 60000 > Date.now());
            };

            this.message = function(message) {
                alertify.alert(message);
                gameState.messages.unshift({ "id": commonFunctions.uuidv4, "message": message, "time": Date.now() });
            };

            this.dismissMessage = function(message) {
                gameState.messages.splice(gameState.messages.indexOf(message), 1);
            };
        };
    }
);