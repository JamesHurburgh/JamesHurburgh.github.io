/*jshint esversion: 6 */

/*

1. Rename file and DataManager to Manager name.
2. Update the DATA_FILE variable.
3. Paste the following into AdventureGame:

            _DataManager = new DataManager(this);
            this.DataManager = function() {
                return _DataManager;
            };
4. Delete this comment block.

*/

define([
        "app/CommonFunctions",
        "json!data/achievements.json",
        "json!data/adventurers.json",
        "json!data/adversaries.json",
        "json!data/calendar.json",
        "json!data/contracts.json",
        "json!data/conversations.json",
        "json!data/game.json",
        "json!data/items.json",
        "json!data/locations.json",
        "json!data/renown.json",
        "json!data/settings.json",
        "json!data/skills.json"
    ],
    function DataManager(
        CommonFunctions,
        achievements,
        adventurers,
        adversaries,
        calendar,
        contracts,
        conversations,
        game,
        items,
        locations,
        renown,
        settings,
        skills) {

        commonFunctions = new CommonFunctions();

        return function DataManager(gameState) {

            this.gameState = gameState;

            this.achievements = achievements;
            this.adventurers = adventurers;
            this.adversaries = adversaries;
            this.skills = skills;
            this.calendar = calendar;
            this.contracts = contracts;
            this.conversations = conversations;
            this.game = game;
            this.items = items;
            this.locations = locations;
            this.renown = renown;
            this.settings = settings;

            this.getData = function(type, name) {
                var item = this[type].filter(item => item.name == name)[0]
                if (item === undefined) {
                    item = { "name": "undefined" };
                }
                return item;
            };
        };
    }
);