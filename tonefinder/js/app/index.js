requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['vue', 'Tone'],
    function(Vue, Tone) {

        Vue.component('link-item', {
            props: ['link'],
            template: '#link-item',
            methods: {
                removeTravelLog: function(event) {
                    tl.remove(this.link.url);
                    return false;
                }
            },
        });

        getRandomFromList = function(array) {
            return array[Math.floor(Math.random() * array.length)];
        };

        var toneFinder = {};

        var app = new Vue({
            el: '#toneFinder',
            data: toneFinder,
            methods: {
                play: function() {
                    var synth = new Tone.Synth({
                        "oscillator": {
                            "type": getRandomFromList([
                                "pwm",
                                "pulse",

                                "sine",
                                "fmsine",
                                "amsine",
                                "fatsine",

                                "square",
                                "fmsquare",
                                "amsquare",
                                "fatsquare",

                                "triangle",
                                "fmtriangle",
                                "amtriangle",
                                "fattriangle",

                                "sawtooth",
                                "fmsawtooth",
                                "amsawtooth",
                                "fatsawtooth",
                            ]),
                            "phase": Math.random() * 360,
                            "modulationFrequency": Math.random()
                        },
                        "envelope": {
                            "attack": Math.random(),
                            "decay": Math.random(),
                            "sustain": Math.random(),
                            "release": Math.random(),
                        }
                    }).toMaster();

                    //play a middle 'C' for the duration of an 8th note
                    synth.triggerAttackRelease(Math.random() * 500 + 100, Math.random());
                }
            }
        });

    });