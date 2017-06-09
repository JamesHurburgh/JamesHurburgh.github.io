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
                },
                "portamento": soundDef.portamento
            }).toMaster();
        };

        createTone = function(soundDef) {
            var tone = {};
            tone.synth = createSynth(soundDef);
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
            sound.startFrequency = Math.floor(Math.random() * 200000) / 100 + 10;
            sound.portamento = Math.ceil(Math.random() * 100) / 100;
            sound.endFrequency = Math.floor(Math.random() * 200000) / 100 + 10;
            sound.duration = Math.ceil(Math.random() * 100) / 100;
            sound.name = Math.floor(Math.random() * Math.pow(10, 6));

            sound.polySynths = Math.floor(Math.random() + Math.random() + Math.random());

            return makeVariation(sound);
        };

        var variationFunctions = [
            function(soundDef) {
                soundDef.oscillatorType = getRandomFromList(oscillatorTypes);
                soundDef.VariantDescription = "Oscillator Type:" + soundDef.oscillatorType;
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeAttackCurve = getRandomFromList(curveTypes);
                soundDef.VariantDescription = "Attack Curve:" + soundDef.envelopeAttackCurve;
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeReleaseCurve = getRandomFromList(curveTypes);
                soundDef.VariantDescription = "Release Curve:" + soundDef.envelopeReleaseCurve;
                return soundDef;
            },
            // Envelope Attack
            function(soundDef) {
                soundDef.envelopeAttack *= 2;
                soundDef.VariantDescription = "Envelope Attack x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeAttack /= 2;
                soundDef.VariantDescription = "Envelope Attack / 2";
                return soundDef;
            },
            // Envelope Decay
            function(soundDef) {
                soundDef.envelopeDecay *= 2;
                soundDef.VariantDescription = "Envelope Decay x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeDecay /= 2;
                soundDef.VariantDescription = "Envelope Decay / 2";
                return soundDef;
            },
            // Envelope Sustain
            function(soundDef) {
                soundDef.envelopeSustain *= 2;
                soundDef.VariantDescription = "Envelope Sustain x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeSustain /= 2;
                soundDef.VariantDescription = "Envelope Sustain / 2";
                return soundDef;
            },
            // Envelope Release
            function(soundDef) {
                soundDef.envelopeRelease *= 2;
                soundDef.VariantDescription = "Envelope Release x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.envelopeRelease /= 2;
                soundDef.VariantDescription = "Envelope Release / 2";
                return soundDef;
            },
            // Start Frequency
            function(soundDef) {
                soundDef.startFrequency *= 2;
                soundDef.VariantDescription = "Start Frequency x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.startFrequency /= 2;
                soundDef.VariantDescription = "Start Frequency / 2";
                return soundDef;
            },
            // End Frequency
            function(soundDef) {
                soundDef.endFrequency *= 2;
                soundDef.VariantDescription = "End Frequency x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.endFrequency /= 2;
                soundDef.VariantDescription = "End Frequency / 2";
                return soundDef;
            },
            // Duration
            function(soundDef) {
                soundDef.duration *= 2;
                soundDef.VariantDescription = "Duration x 2";
                return soundDef;
            },
            function(soundDef) {
                soundDef.duration /= 2;
                soundDef.VariantDescription = "Duration / 2";
                return soundDef;
            },
        ];

        makeVariation = function(soundDefinition) {
            var deepCopy = JSON.parse(JSON.stringify(soundDefinition));
            deepCopy.name = Math.floor(Math.random() * Math.pow(10, 6));
            return variationFunctions[Math.floor(Math.random() * variationFunctions.length)](deepCopy);
        };

        var toneFinder = {};

        toneFinder.soundDefinition = createRandomSoundDefinition();

        playSound = function(soundDef) {

            var tone = createTone(soundDef);

            tone.synth.triggerAttack(soundDef.startFrequency);
            tone.synth.setNote(soundDef.endFrequency, "+" + soundDef.portamento);
            tone.synth.triggerRelease("+" + (soundDef.portamento + soundDef.duration));

            // tone.synth.triggerAttackRelease("G4", "2n", "8t", 1); 
            // tone.synth.triggerAttackRelease("A4", "8n", 1); 
            // tone.synth.triggerAttackRelease("F4", "8n", 2); 


            // var chorus = new Tone.Chorus(4, 2.5, 0.5);
            // var synth = new Tone.PolySynth(4, Tone.MonoSynth).connect(chorus);
            // synth.triggerAttackRelease(["C3","E3","G3"], "8n");

        };

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
                    // Use JSON to deep clone the object
                    toneFinderApp.soundDefinition = JSON.parse(JSON.stringify(this.saved));
                },
                play: function() {
                    playSound(this.saved);
                },

            }
        });

        Vue.component('variant-template', {
            props: ['variant'],
            template: '#variant-template',
            computed: {},
            methods: {
                load: function() {
                    // Use JSON to deep clone the object
                    toneFinderApp.soundDefinition = JSON.parse(JSON.stringify(this.variant));
                },
                play: function() {
                    playSound(this.variant);
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
                variants: function() {
                    var variants = [];
                    for (var i = 0; i < 16; i++) {
                        variants.push(makeVariation(toneFinder.soundDefinition));
                    }
                    return variants;
                }
            },
            methods: {
                play: function() {
                    playSound(toneFinder.soundDefinition);
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