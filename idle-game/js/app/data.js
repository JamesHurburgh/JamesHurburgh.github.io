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
        'alertify',
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
    function(
        $,
        Vue,
        alertify,
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
            settings: settings,
            input: { newTask: null }
        };

        var controller = new Vue({
            el: '#data',
            data: data,
            computed: {},
            methods: {
                toId: function(name) {
                    return name.toLowerCase().replace(/\W/g, '-');
                },
                getSkill: function(name) {
                    var skill = skills.filter(skill => skill.name == name)[0];
                    if (skill === undefined) {
                        skill = { "name": "unknown" };
                    }
                    return skill;
                },
                exportData: function(content, title) {
                    if (!title) { title = "export"; }
                    var name = prompt("Export as", title + '.json');
                    if (!name || name === undefined || name === "") {
                        name = 'export.json';
                    }

                    fixContractIssues(content);
                    var text = encodeURIComponent(JSON.stringify(content));
                    var data = "data:text/json;charset=utf-8," + text;

                    var hf = document.createElement('a');

                    hf.href = data;
                    hf.download = name;
                    hf.innerHTML = hf.download;
                    document.getElementsByTagName("body")[0].appendChild(hf);
                    hf.click();
                    document.getElementsByTagName("body")[0].removeChild(hf);
                },
                addNewTaskToContract: function(contract) {
                    if (!this.input.newTask) {
                        this.input.newTask = {};
                    } else {
                        if (!contract.tasks) contract.tasks = [];
                        contract.tasks.push(this.input.newTask);
                        this.input.newTask = null;
                    }
                },
                contractIssues: function(contract) {
                    return validateContract(contract);
                },
                postContract: function(data, title) {

                    alertify
                        .defaultValue("Please provide a short description.")
                        .prompt("Submit contract",
                            function(val, ev) {

                                // The click event is in the event variable, so you can use it here.
                                ev.preventDefault();
                                fixContractIssues(data);
                                postSubmission(data, title, val);
                                // The value entered is availble in the val variable.
                                alertify.success("Thanks for submitting your ideas!");
                            },
                            function(ev) {
                                // The click event is in the event variable, so you can use it here.
                                ev.preventDefault();
                                alertify.error("Submission cancelled.");
                            }
                        );
                }
            },
        });

        function validateContract(contract) {
            if (!contract) return [];
            var issues = [];
            if (!contract.startTaskId) {
                issues.push("No start task defined");
            }
            if (!contract.tasks || contract.tasks.length === 0) {
                issues.push("No tasks defined");
            } else {

                var taskLinks = [];
                var taskIds = [];
                contract.tasks.forEach(function(task) {
                    if (task.taskAfterSuccess && taskLinks.indexOf(task.taskAfterSuccess) < 0) { taskLinks.push(task.taskAfterSuccess); }
                    if (task.taskAfterFail && taskLinks.indexOf(task.taskAfterFail) < 0) { taskLinks.push(task.taskAfterFail); }
                    if (taskIds.indexOf(task.id) >= 0) {
                        issues.push("Task '" + task.id + "' defined more than once.");
                    } else {
                        taskIds.push(task.id);
                    }
                }, this);

                taskIds.forEach(function(taskId) {
                    if (taskLinks.indexOf(taskId) < 0 && contract.startTaskId != taskId) {
                        issues.push("Task '" + taskId + "' can never be reached.");
                    }
                }, this);

                taskLinks.forEach(function(taskId) {
                    if (taskIds.indexOf(taskId) < 0) {
                        issues.push("Task '" + taskId + "' is referenced but never defined.");
                    }
                }, this);
            }

            if (!contract.requirements) {
                issues.push("No requirements object. (Will be fixed on export or submit)");
            } else {
                if (contract.requirements.attributes) {
                    issues.push("Requirements Attributes is deprecated. (Will be fixed on export or submit)");
                }
                if (contract.requirements.adventurers) {
                    issues.push("Requirements Adventurers is deprecated. (Will be fixed on export or submit)");
                }
            }

            return issues;

        }

        function fixContractIssues(contract) {
            if (contract.requirements === undefined || contract.requirements === null) {
                contract.requirements = [];
            } else {
                if (contract.requirements.attributes) {
                    contract.requirements.attributes = undefined;
                }
                if (contract.requirements.adventurers) {
                    contract.requirements.adventurers = undefined;
                }
            }
        }

        function postSubmission(data, title, description) {
            var url = "https://api.paste.ee/v1/pastes";
            var method = "POST";
            var stringifiedData = JSON.stringify(data);
            var postData = { "description": description, "sections": [{ "name": title, "syntax": "json", "contents": stringifiedData }] };

            var shouldBeAsync = true;

            var request = new XMLHttpRequest();

            request.onload = function() {
                // You can get all kinds of information about the HTTP response.
                var status = request.status; // HTTP response status, e.g., 200 for "200 OK"
                var data = request.responseText; // Returned data, e.g., an HTML document.
            };

            request.open(method, url, shouldBeAsync);

            request.setRequestHeader("Content-Type", "application/json");
            request.setRequestHeader("X-Auth-Token", "ui1BlnKK7t78qs9L6Ot4AuW8f2pBPTUSBM0X5n4Sv");

            var stringifiedPostData = JSON.stringify(postData);
            request.send(stringifiedPostData);
        }

    });