/*jshint esversion: 6 */

/*

1. Rename file and SessionManager to Manager name.
2. Update the DATA_FILE variable.
3. Paste the following into AdventureGame:

            _SessionManager = new SessionManager(this);
            this.SessionManager = function() {
                return _SessionManager;
            };
4. Delete this comment block.

*/

define([
    "app/CommonFunctions"
],
    function SessionManager(CommonFunctions) {

        commonFunctions = new CommonFunctions();

        return function SessionManager(gameController) {

            this.gameController = gameController;
            this.gameState = gameController.gameState;
            // Login
            this.login = function () {
                log("login");

                this.gameState.timeSinceLastLogin = -1;
                var loginTime = Date.now();
                if (this.gameState.loginTracker === undefined) {
                    this.gameState.loginTracker = [];
                } else if (this.gameState.loginTracker.length > 0) {
                    this.gameState.timeSinceLastLogin = loginTime - this.gameState.loginTracker[this.gameState.loginTracker.length - 1].logout;
                }
                this.gameState.loginTracker.push({ "login": loginTime });
            };

            this.stillLoggedIn = function () {
                if (this.gameState.loginTracker === undefined || this.gameState.loginTracker === null || this.gameState.loginTracker.length === 0) {
                    this.gameState.loginTracker = [];
                    this.gameState.loginTracker.push({ "login": Date.now() });
                }
                this.gameState.loginTracker[this.gameState.loginTracker.length - 1].logout = Date.now();
            };

        };
    }
);