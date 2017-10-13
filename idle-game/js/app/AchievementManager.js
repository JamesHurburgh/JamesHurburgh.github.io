/*jshint esversion: 6 */

define([
    "app/CommonFunctions",
    "json!data/achievements.json"],
    function AchievementManager(CommonFunctions, achievements) {

        commonFunctions = new CommonFunctions();

        return function AchievementManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getClaimedAchievements = function () {
                if (!this.gameState.claimedAchievements) this.gameState.claimedAchievements = [];
                return this.gameState.claimedAchievements;
            };

            // Achievements
            this.hasAchievement = function (achievement) {
                return this.getClaimedAchievements().filter(claimedAchievement => claimedAchievement.name == achievement.name).length > 0;
            };

            this.claimAchievement = function (achievement) {
                if (!this.hasAchievement(achievement.name)) {
                    this.getClaimedAchievements().push({ "name": achievement.name, "timeClaimed": Date.now() });
                    this.gameController.MessageManager().message("Got achievement:" + achievement.name + " (" + achievement.description + ")");
                }
            };

            this.canClaimAchievement = function (achievement) {
                if (this.hasAchievement(achievement)) {
                    return false;
                }
                switch (achievement.trigger.type) {
                    case "statistic":
                        var stat = this.gameController.StatisticsManager().getStat(achievement.trigger.statistic);
                        return stat && stat.current > achievement.trigger.statisticamount;
                }
            };

            this.checkAndClaimAchievement = function (achievement) {
                if (this.canClaimAchievement(achievement)) {
                    this.claimAchievement(achievement);
                }
            };

            this.checkAndClaimAllAchievements = function () {
                for (var i = 0; i < achievements.length; i++) {
                    this.checkAndClaimAchievement(achievements[i]);
                }
            };

            this.achievementProgress = function (achievement) {
                if (this.hasAchievement(achievement)) {
                    return 100;
                }
                switch (achievement.trigger.type) {
                    case "statistic":
                        var stat = this.gameController.StatisticsManager().getStat(achievement.trigger.statistic);
                        if (stat) {
                            return (stat.current / achievement.trigger.statisticamount) * 100;
                        }
                }
                return 0;
            };

        };
    }
);