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
requirejs(['vue', 'Tone', 'store'],
    function(Vue, Tone, store) {

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

        var oscillatorTypes = [
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

        var curveTypes = ["linear", "exponential", "sine", "cosine", "bounce", "ripple", "step"];

        createSynth = function(soundDef) {
            return new Tone.Synth({
                "oscillator": {
                    "type": soundDef.oscillatorType,
                    "phase": soundDef.oscillatorPhase
                },
                "envelope": {
                    "attack": soundDef.envelopeAttack,
                    "attackCurve": soundDef.envelopeAttackCurve,
                    "decay": soundDef.envelopeDecay,
                    "sustain": soundDef.envelopeSustain,
                    "release": soundDef.envelopeRelease,
                    "releaseCurve": soundDef.envelopeReleaseCurve,
                }
            }).toMaster();
        };

        createTone = function(soundDef) {
            var tone = {};
            tone.synth = createSynth(soundDef);
            tone.frequency = soundDef.frequency;
            tone.duration = soundDef.duration;
            tone.name = soundDef.name;

            return tone;
        };

        createRandomSoundDefinition = function() {
            var sound = {};

            sound.oscillatorType = getRandomFromList(oscillatorTypes);
            sound.oscillatorPhase = Math.floor(Math.random() * 36000) / 100;

            sound.envelopeAttack = Math.floor(Math.random() * 200) / 100;
            sound.envelopeAttackCurve = getRandomFromList(curveTypes);
            sound.envelopeDecay = Math.floor(Math.random() * 200) / 100;
            sound.envelopeSustain = Math.floor(Math.random() * 200) / 100;
            sound.envelopeRelease = Math.floor(Math.random() * 200) / 100;
            sound.envelopeReleaseCurve = getRandomFromList(curveTypes);

            sound.frequency = Math.floor(Math.random() * 200000) / 100 + 10;
            sound.duration = Math.ceil(Math.random() * 100) / 100;
            sound.name = Math.floor(Math.random() * Math.pow(10, 6));

            return sound;
        };

        var toneFinder = {};

        toneFinder.soundDefinition = createRandomSoundDefinition();


        Vue.component('saved-template', {
            props: ['saved'],
            template: '#saved-template',
            computed: {},
            methods: {
                remove: function() {
                    for (var i = 0; i < savedTones.toneList.length; i++) {
                        if (savedTones.toneList[i].name == this.saved.name) {
                            savedTones.toneList.splice(i, 1);
                        }
                    }
                    store.set("tones", savedTones.toneList);
                },
                load: function() {
                    savedTones.toneList.forEach(function(soundDefinition) {
                        if (soundDefinition.name == this.saved.name) {
                            // Use JSON to deep clone the object
                            toneFinderApp.soundDefinition = JSON.parse(JSON.stringify(soundDefinition));
                        }
                    }, this);
                },
                play: function() {
                    var tone = createTone(this.saved);

                    tone.synth.triggerAttackRelease(tone.frequency, tone.duration);
                },
            }
        });

        var toneFinderApp = new Vue({
            el: '#toneFinder',
            data: toneFinder,
            computed: {
                oscillatorTypes: function() {
                    return oscillatorTypes;
                },
                curveTypes: function() {
                    return curveTypes;
                },
            },
            methods: {
                play: function() {
                    var tone = createTone(toneFinder.soundDefinition);

                    tone.synth.triggerAttackRelease(tone.frequency, tone.duration);
                },
                randomise: function() {
                    toneFinder.soundDefinition = createRandomSoundDefinition();
                },
                save: function() {
                    if (savedTones.toneList === undefined) {
                        savedTones.toneList = [];
                    }
                    for (var i = 0; i < savedTones.toneList.length; i++) {
                        if (savedTones.toneList[i].name == toneFinder.soundDefinition.name) {
                            return;
                        }
                    }
                    // Use JSON to deep clone the object
                    savedTones.toneList.push(JSON.parse(JSON.stringify(toneFinder.soundDefinition)));
                    store.set("tones", savedTones.toneList);
                },
            }
        });

        var savedTones = { "toneList": store.get("tones") };

        var savedTonesApp = new Vue({
            el: '#savedTones',
            data: savedTones,
            computed: {},
        });


    });