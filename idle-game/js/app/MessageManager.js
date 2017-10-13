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

        return function MessageManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getMessages = function() {
                if (!this.gameState.messages) this.gameState.messages = [];
                return this.gameState.messages;
            };

            this.showMessageTab = function() {
                return this.getMessages().length !== 0;
            };

            this.recentMessages = function() {
                return this.getMessages().filter(message => message.time + 60000 > Date.now());
            };

            this.message = function(message) {
                alertify.alert(message);
                this.getMessages().unshift({ "id": commonFunctions.uuidv4, "message": message, "time": Date.now() });
            };

            this.dismissMessage = function(message) {
                this.getMessages().splice(this.getMessages().indexOf(message), 1);
            };
        };
    }
);