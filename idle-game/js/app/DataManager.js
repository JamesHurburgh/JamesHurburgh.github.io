/*jshint esversion: 6 */

define([
    "app/CommonFunctions",
    "json!data/achievements.json",
    "json!data/adventurers.json",
    "json!data/adversaries.json",
    "json!data/anatomy.json",
    "json!data/calendar.json",
    "json!data/contracts.json",
    "json!data/conversations.json",
    "json!data/game.json",
    "json!data/items.json",
    "json!data/locations.json",
    "json!data/races.json",
    "json!data/renown.json",
    "json!data/settings.json",
    "json!data/skills.json"
],
    function DataManager(
        CommonFunctions,
        achievements,
        adventurers,
        adversaries,
        anatomy,
        calendar,
        contracts,
        conversations,
        game,
        items,
        locations,
        races,
        renown,
        settings,
        skills) {

        commonFunctions = new CommonFunctions();

        return function DataManager(gameState) {

            this.gameState = gameState;

            this.achievements = achievements;
            this.adventurers = adventurers;
            this.adversaries = adversaries;
            this.anatomy = anatomy;
            this.skills = skills;
            this.calendar = calendar;
            this.contracts = contracts;
            this.conversations = conversations;
            this.game = game;
            this.items = items;
            this.locations = locations;
            this.races = races;
            this.renown = renown;
            this.settings = settings;

            this.getData = function (type, name) {
                var item = this[type].filter(item => item.name == name)[0]
                if (item === undefined) {
                    item = { "name": "undefined" };
                }
                return item;
            };
        };
    }
);