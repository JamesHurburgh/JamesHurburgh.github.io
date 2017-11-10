 /*jshint esversion: 6 */

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

         String.prototype.hashCode = function() {
             var hash = 0,
                 i, chr;
             if (this.length === 0) return hash;
             for (i = 0; i < this.length; i++) {
                 chr = this.charCodeAt(i);
                 hash = ((hash << 5) - hash) + chr;
                 hash |= 0; // Convert to 32bit integer
             }
             return hash;
         };

         return function CharacterEditor() {
             console.log("Initialising CharacterEditor definition");

             // fields
             this.loadedCharacter = {};
             this.loadModalFilter = "";
             this.counter = 10;


             // methods
             this.initialize = function() {
                 console.log("Creating CharacterEditor");
                 this.localCharacters = this.getLocalCharacters();
                 if (!this.localCharacters || this.localCharacters.length === 0) {
                     this.loadedCharacter = new Character();
                 } else {
                     this.loadLocallyFromHashCode(this.localCharacters[this.localCharacters.length - 1].hashCode);
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

             this.getFilteredLocalCharacters = function() {
                 var filter = this.loadModalFilter;
                 if (!filter) {
                     return this.localCharacters;
                 }
                 return this.localCharacters.filter(savedCharacter => savedCharacter.characterName.toLowerCase().indexOf(filter.toLowerCase().trim()) !== -1);
             };

             this.getLocalCharacters = function() {
                 var characters = store.get("characters");
                 if (!characters) characters = [];
                 return characters;
             };

             this.saveLocally = function() {
                 if (!this.localCharacters) return;
                 this.localCharacters = this.getLocalCharacters();

                 var saveTime = Date.now();
                 var hashCode = (this.loadedCharacter.name + saveTime.toLocaleString()).hashCode();

                 store.set(hashCode, this.loadedCharacter);
                 this.localCharacters.push({ characterName: this.loadedCharacter.name, saveTime: saveTime, hashCode: hashCode });
                 store.set("characters", this.localCharacters);

                 this.localCharacters = this.getLocalCharacters();
             };

             this.loadLocallyFromHashCode = function(hash) {
                 this.loadCharacter(store.get(hash));
             };

             this.deleteSavedCharacter = function(hashCode) {
                 if (!this.localCharacters) return;
                 this.localCharacters = this.localCharacters.filter(saved => saved.hashCode != hashCode);
                 store.set("characters", this.localCharacters);
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