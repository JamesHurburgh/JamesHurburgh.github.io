define(
    [
        "models/Character",
        "app/CharacterGenerator",
        "store"
    ],
    function(
        Character,
        CharacterGenerator,
        store) {

        return function CharacterEditor() {
            console.log("Initialising CharacterEditor definition");

            // fields
            this.loadedCharacter = {};
            this.counter = 10;

            // methods
            this.initialize = function() {
                console.log("Creating CharacterEditor");
                if (store.get("character")) {
                    this.loadLocally();
                } else {
                    this.loadedCharacter = new Character();
                }
            };

            this.loadCharacter = function(character) {
                this.loadedCharacter = new Character(character);
            };

            this.createCharacter = function() {
                console.log("New character");
                this.loadedCharacter = new Character();
            };

            this.createRandomCharacter = function() {
                this.loadedCharacter = CharacterGenerator.generateRandomCharacter();
            };

            this.saveLocally = function() {
                store.set("character", this.loadedCharacter);
            };

            this.loadLocally = function() {
                this.loadCharacter(store.get("character"));
            };

            this.saveToFile = function() {
                this.exportJson(this.loadedCharacter);
            };

            this.exportJson = function(character) {
                var name = prompt("Export as", character.name + '.json');
                if (!name || name === undefined || name === "") {
                    name = 'character.json';
                }

                var text = encodeURIComponent(JSON.stringify(character));
                var data = "data:text/json;charset=utf-8," + text;

                var hf = document.createElement('a');

                hf.href = data;
                hf.download = name;
                hf.innerHTML = hf.download;
                document.getElementsByTagName("body")[0].appendChild(hf);
                hf.click();
                document.getElementsByTagName("body")[0].removeChild(hf);
            };

            /// Expects an event from a file input
            this.loadFromFile = function(event) {
                if (!window.FileReader) {
                    throw 'browser is not supported';
                }
                var input = event.target;

                // Create a reader object
                var reader = new FileReader();
                if (input.files.length) {
                    var textFile = input.files[0];
                    // Read the file
                    reader.readAsText(textFile);
                    // When it's loaded, process it
                    var controller = this;
                    reader.onload = function(e) {
                        controller.loadCharacter(JSON.parse(reader.result));
                    };
                } else {
                    throw 'no file uploaded';
                }
            };

            // Initialise
            this.initialize();
        };
    });