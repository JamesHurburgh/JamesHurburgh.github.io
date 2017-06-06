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

        var oscialltorTypes = [
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
        ];

        createRandomSynth = function() {
            return new Tone.Synth({
                "oscillator": {
                    "type": getRandomFromList(oscialltorTypes),
                    "phase": Math.random() * 360
                },
                "envelope": {
                    "attack": Math.random(),
                    "decay": Math.random(),
                    "sustain": Math.random(),
                    "release": Math.random(),
                }
            }).toMaster();
        };

        createRandomTone = function() {
            var tone = {};
            tone.synth = createRandomSynth();
            tone.frequency = Math.random() * 500 + 100;
            tone.duration = Math.random();

            return tone;
        };

        var toneFinder = {};
        toneFinder.tone = createRandomTone();

        var app = new Vue({
            el: '#toneFinder',
            data: toneFinder,
            methods: {
                play: function() {
                    //play a middle 'C' for the duration of an 8th note
                    toneFinder.tone.synth.triggerAttackRelease(toneFinder.tone.frequency, toneFinder.tone.duration);
                },
                randomise: function() {
                    toneFinder.tone = createRandomTone();
                }
            }
        });

    });