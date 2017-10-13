/*jshint esversion: 6 */

/*

1. Rename file and StatisticsManager to Manager name.
2. Update the DATA_FILE variable.
3. Paste the following into AdventureGame:

            _StatisticsManager = new StatisticsManager(this);
            this.StatisticsManager = function() {
                return _StatisticsManager;
            };
4. Delete this comment block.

*/

define([
    "app/CommonFunctions",
    "app/DataManager"],
    function StatisticsManager(CommonFunctions, DataManager) {

        commonFunctions = new CommonFunctions();

        return function StatisticsManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getStatistics = function () {
                if (!this.gameState.stats) this.gameState.stats = [];
                return this.gameState.stats;
            };

            this.getStatName = function (action, subject) {
                return (action + "-" + subject).toLowerCase().replace(/ /g, "_");
            };

            this.getStat = function (name) {
                return this.getStatistics().filter(stat => stat.name == name)[0];
            };

            this.trackStat = function (action, subject, amount) {
                var name = this.getStatName(action, subject);
                stat = this.getStat(name);
                if (!stat) {
                    this.getStatistics().push({ name: name, current: amount, allTime: amount });
                } else {
                    stat.current += amount;
                    stat.allTime += amount;
                }
            };

            this.filteredStats = function (filter) {
                if (!filter) {
                    return this.getStatistics();
                }
                return this.getStatistics().filter(stat => stat.name.indexOf(filter.toLowerCase().trim()) !== -1);
            };
        };
    }
);