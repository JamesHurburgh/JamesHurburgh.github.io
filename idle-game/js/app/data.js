requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        models: '../app/models',
        data: '../../data',
    }
});

// Start the main app logic.
requirejs([
    'jquery',
    'vue',
    "json!data/achievements.json",
    "json!data/adventurers.json",
    "json!data/adversaries.json",
    "json!data/skills.json",
    "json!data/calendar.json",
    "json!data/contracts.json",
    "json!data/conversations.json",
    "json!data/game.json",
    "json!data/items.json",
    "json!data/locations.json",
    "json!data/races.json",
    "json!data/renown.json",
    "json!data/settings.json"
],
    function (
        $,
        Vue,
        achievements,
        adventurers,
        adversaries,
        skills,
        calendar,
        contracts,
        conversations,
        game,
        items,
        locations,
        races,
        renown,
        settings
    ) {
        var data = {
            achievements: achievements,
            adventurers: adventurers,
            adversaries: adversaries,
            skills: skills,
            calendar: calendar,
            contracts: contracts,
            conversations: conversations,
            game: game,
            items: items,
            locations: locations,
            renown: renown,
            races: races,
            settings: settings
        };

        var controller = new Vue({
            el: '#data',
            data: data,
            computed: {},
            methods: {
                toId: function (name) {
                    return name.toLowerCase().replace(/\W/g, '');
                },
                getSkill: function (name) {
                    var skill = skills.filter(skill => skill.name == name)[0];
                    if (skill === undefined) {
                        skill = { "name": "unknown" };
                    }
                    return skill;
                }
            },
        });

    });