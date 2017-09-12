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
        models: '../app/models'
    }
});

// Start the main app logic.
requirejs(['jquery', 'vue', 'alertify', 'store', 'chance', 'app/faces'],
    function($, Vue, alertify, store, chance, faces) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        var idleGameData; // = store.get("idleGameData");

        var gameDifficulty = 3; // 100 is normal

        // TODO load if available
        if (idleGameData === undefined || idleGameData === null) {
            alertify.success("New Game Started!");
            idleGameData = {
                ticks: 0,
                firstTick: new Date(),
                timeOfLastTick: new Date(),
                tick: function() {
                    var now = new Date();
                    var ticksElapsed = now - this.timeOfLastTick;
                    this.doTicks(ticksElapsed);
                    this.timeOfLastTick = now;
                },
                doTicks: function(ticks) {
                    this.ticks += ticks;

                    this.taskAssignments.forEach(function(taskAssignment) {
                        var task = idleGameData.getActivity(taskAssignment.taskName);
                        var worker = idleGameData.getWorker(taskAssignment.workerName);
                        if(worker.taskStatus == 'active' && task.canDo()){

                            var effortModifier = 1;
                            task.skills.forEach(function(skill) {
                                var skillFound = false;
                                worker.skills.forEach(function(workerSkill) {
                                    if (skill == workerSkill.name) {
                                        var modifier = Math.floor(Math.sqrt(workerSkill.level)) / 100 + 1;
                                        effortModifier *= modifier;
                                        workerSkill.level += 0.01;
                                        skillFound = true;
                                    }
                                }, this);
                                if (!skillFound) {
                                    worker.skills.push({ name: skill, level: 1 });
                                }
                            }, this);
                            if (!taskAssignment.progress || taskAssignment.progress >= 1) {
                                taskAssignment.progress = 0;
                            }

                            taskAssignment.progress += ticks * effortModifier / task.difficulty();
                            worker.secondsLeft = Math.max(0, (1 - taskAssignment.progress)) / ((effortModifier / task.difficulty()) * 1000);
                            if (taskAssignment.progress > 1) {
                                //worker.taskStatus = "done";
                                task.action(Math.floor(taskAssignment.progress), worker);
                                taskAssignment.progress = 0;
                            }
                            worker.progress = taskAssignment.progress;
                        }
                    });
                },

                getActivityAssignmentsByActivity: function(name) {
                    var assignments = [];
                    idleGameData.taskAssignments.forEach(function(taskAssignment) {
                        if (taskAssignment.name == name) {
                            assignments.push(taskAssignment);
                        }
                    });
                    return assignments;
                },

                getActivity: function(name) {
                    var taskFound;
                    idleGameData.activities.forEach(function(activity) {
                        if (activity.name == name) {
                            taskFound = activity;
                        }
                    });
                    return taskFound;
                },
                getWorker: function(name) {
                    var workerFound;
                    idleGameData.workers.forEach(function(worker) {
                        if (worker.name == name) {
                            workerFound = worker;
                        }
                    });
                    return workerFound;
                },
                getResource: function(name) {
                    var resourceFound;
                    idleGameData.resources.forEach(function(resource) {
                        if (resource.name == name) {
                            resourceFound = resource;
                        }
                    });
                    return resourceFound;
                },
                getStat: function(name) {
                    var statFound;
                    idleGameData.stats.forEach(function(stat) {
                        if (stat.name == name) {
                            statFound = stat;
                        }
                    });
                    return statFound;
                },

                activities: [{
                        name: "rock collecting",
                        skills: ["collecting", "rocks"],
                        difficulty: function() { return 200 * gameDifficulty; },
                        active: true,
                        action: function(amount) {
                            idleGameData.getResource("rocks").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "stick collecting",
                        skills: ["collecting", "sticks"],
                        difficulty: function() { return 200 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("sticks").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "dirt collecting",
                        skills: ["collecting", "dirt"],
                        difficulty: function() { return 200 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("dirt").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "berry collecting",
                        skills: ["collecting", "berries"],
                        difficulty: function() { return 400 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("berries").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "vine collecting",
                        skills: ["collecting", "vines"],
                        difficulty: function() { return 400 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("vines").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "leaf collecting",
                        skills: ["collecting", "leaves"],
                        difficulty: function() { return 400 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("leaves").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "water collecting",
                        skills: ["collecting", "water"],
                        difficulty: function() { return 600 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("water").amount += amount;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "tent building",
                        skills: ["tent", "building"],
                        difficulty: function() { return 6000 * gameDifficulty; },
                        active: false,
                        action: function(amount) {
                            idleGameData.getResource("sticks").amount -= amount * 10;
                            idleGameData.getResource("leaves").amount -= amount * 100;
                            idleGameData.getResource("vines").amount -= amount * 5;
                            idleGameData.getResource("tents").amount += amount;
                        },
                        canDo: function(){ 
                            return idleGameData.getResource("sticks").amount >= 10 &&
                            idleGameData.getResource("leaves").amount >= 100 &&
                            idleGameData.getResource("vines").amount >= 5; 
                        }
                    },
                    {
                        name: "recruiting",
                        skills: ["recruiting", "talking"],
                        difficulty: function() { return 2000 * gameDifficulty * Math.pow(idleGameData.getStat("crowding").value(), 2); },
                        active: false,
                        action: function(amount) {
                            for (var i = 0; i < amount; i++) {
                                var newWorker = createNewWorker(1);
                                idleGameData.workers.push(newWorker);
                                alertify.success("New worker recruited: " + newWorker.name);
                            }
                            return;
                        },
                        canDo: function(){ return true; }
                    },
                    {
                        name: "managing",
                        skills: ["organising", "talking"],
                        difficulty: function() { return 100 * gameDifficulty * idleGameData.workers.length; },
                        active: false,
                        action: function(amount, activeWorker) {
                            for (var i = 0; i < amount; i++) {
                                var idleWorker;
                                for(var w = 0; w < idleGameData.workers.length && idleWorker === undefined; w++){
                                    var worker = idleGameData.workers[w];
                                    if(worker.taskStatus == "done"){
                                        idleWorker = worker;
                                        idleWorker.taskStatus = "active";
                                    }
                                }

                                activeWorker.taskStatus = "active";
                            }
                            return;
                        },
                        canDo: function(){ return true; }
                    },
                ],

                resources: [
                    { name: "workers", amount: 1, img: "robe.png" },
                    { name: "rocks", amount: 0, img: "rock.png" },
                    { name: "sticks", amount: 0, img: "stick-splitting.png" },
                    { name: "berries", amount: 30, img: "blackcurrant.png" },
                    { name: "leaves", amount: 0, img: "vine-leaf.png" },
                    { name: "dirt", amount: 0, img: "path-tile.png" },
                    { name: "vines", amount: 0, img: "curling-vines.png" },
                    { name: "tents", amount: 1, img: "camping-tent.png" },
                    { name: "houses", amount: 0, img: "house.png" },
                    { name: "water", amount: 50, img: "water-drop.png" },
                ],
                stats: [{
                    name: "crowding",
                    value: function() {
                        var tents = idleGameData.getResource("tents").amount;
                        var houses = idleGameData.getResource("houses").amount;
                        var housing = tents + 5 * houses;
                        return idleGameData.workers.length / housing;
                    },
                    modifier: function() {
                        return this.value * this.value;
                    }
                }],
                upgrades: [{
                    name: "nothing",
                    cost: 0,
                }],
                workers: [createNewWorker(100)],
                taskAssignments: []
            };
        }

        function createNewWorker(level) {
            var newWorker = {
                id: uuidv4(),
                name: new Chance().first() + " " + new Chance().last(),
                age: Math.floor(Math.random(60)) + 18,
                currentTask: "idling",
                skills: [
                    { name: "recruiting", level: 80 * level + Math.floor(Math.random() * 40 * level) },
                    { name: "fighting", level: 80 * level + Math.floor(Math.random() * 40 * level) },
                    { name: "collecting", level: 80 * level + Math.floor(Math.random() * 40 * level) },
                ],
                titles: []
            };
            newWorker.faceSvg = faceOf(newWorker.name);
            return newWorker;
        };

        var idleGame = new Vue({
            el: '#idle-game',
            data: idleGameData,
            computed: {
                ticksSinceLastTick: function() {
                    return new Date() - this.timeOfLastTick;
                }
            },
            methods: {
                reset: function(event) {
                    store.set("idleGameData", null);
                },
                assignWorkers: function(event) {
                    idleGameData.taskAssignments = [];
                    var taskName = event.currentTarget.dataset.task;
                    idleGameData.workers.forEach(function(worker) {
                        idleGameData.taskAssignments.push({ taskName: taskName, workerName: worker.name });
                        worker.currentTask = taskName;
                        worker.taskStatus = "active";
                    }, this);
                },
                assignWorker: function(event) {
                    var taskName = event.currentTarget.dataset.task;
                    var workerName = event.currentTarget.dataset.worker;
                    var assigned = false;
                    idleGameData.taskAssignments.forEach(function(taskAssignment) {
                        if (taskAssignment.workerName == workerName) {
                            taskAssignment.taskName = taskName;
                            assigned = true;
                        }
                    }, this);
                    if (!assigned) {
                        idleGameData.taskAssignments.push({ taskName: taskName, workerName: workerName });
                    }
                    idleGameData.workers.forEach(function(worker) {
                        if (worker.name == workerName) {
                            worker.currentTask = taskName;
                            worker.taskStatus = "active";
                        }
                    }, this);
                }
            }
        });

        function tick() {
            idleGameData.tick();
            //store.set("idleGameData", idleGameData);
            setTimeout(tick, 500);
        }

        // boot up the first call
        tick();


    });