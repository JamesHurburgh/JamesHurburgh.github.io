define([
    'json!data/attributes.json',
    'json!data/skills.json',
    'json!data/arcana.json'
], function(
    attributes,
    skills,
    arcana) {

    console.log("Initialising Character definition");

    var defaults = [
        { "key": "name", "value": "" },
        { "key": "age", "value": 0 },
        { "key": "player", "value": "Player name here" },
        { "key": "chronicle", "value": "" },
        { "key": "concept", "value": "" },
        { "key": "virtue", "value": "" },
        { "key": "vice", "value": "" },
        { "key": "notes", "value": "" },

        { "key": "size", "value": 5 },
        { "key": "gnosis", "value": 1 },
        { "key": "wisdom", "value": 7 },
        { "key": "experience", "value": 0 },

        { "key": "bashingDamage", "value": 0 },
        { "key": "lethalDamage", "value": 0 },
        { "key": "aggravatedDamage", "value": 0 },

        { "key": "flaws", "value": [] },
        { "key": "merits", "value": [] },
        { "key": "derangements", "value": [] },
        { "key": "specialties", "value": {} },

    ];

    // Skills
    skills.forEach(function(skill) {
        defaults.push({ "key": skill.name.toLowerCase(), "value": 0 });
    }, this);

    // Attributes
    attributes.forEach(function(attribute) {
        defaults.push({ "key": attribute.name.toLowerCase(), "value": 1 });
    }, this);

    // Arcana
    arcana.forEach(function(arcanum) {
        defaults.push({ "key": arcanum.name.toLowerCase(), "value": 0 });
    }, this);

    // This is specificallly a Mage the Awakening Character
    function Character(character) {

        this.initialize = function(character) {

            console.log("Creating Character");
            var newCharacter = (character === undefined);

            if (!newCharacter) {
                for (var property in character) {
                    if (character.hasOwnProperty(property)) {
                        this[property] = character[property];
                    }
                }
            }

            // Ensure all fields are intialised
            defaults.forEach(function(de) {
                this.initialiseField(de.key, de.value, newCharacter);
            }, this);

            // Starting Values
            this.initialiseField('willpower', this.maxWillpower(), newCharacter);
            this.initialiseField('mana', this.wisdom, newCharacter);

        };

        this.initialiseField = function(fieldName, defaultValue, newCharacter) {
            if (!this[fieldName]) {
                this[fieldName] = defaultValue;
                if (!newCharacter) {
                    console.log("Initialising field on established character: " + fieldName);
                }
            }
        };

        this.maxHealth = function() {
            return this.size + this.stamina;
        };

        this.maxWillpower = function() {
            return this.resolve + this.composure;
        };

        this.maxMana = function() {
            // TODO work out calculation for this.
            return 10;
        };

        this.defense = function() {
            return Math.min(this.dexterity, this.wits);
        };

        this.initiativeMod = function() {
            return this.dexterity + this.composure;
        };

        this.speed = function() {
            return this.dexterity + this.strength + 5;
        };

        this.getTotalDamageBlocks = function() {
            return this.bashingDamage + this.lethalDamage + this.aggravatedDamage;
        };

        this.isDead = function() {
            return this.aggravatedDamage >= this.maxHealth();
        };

        this.addBashingDamage = function() {

            // Don't bother once they are dead.  You're literally flogging a dead character.
            if (this.isDead()) return;

            // If there are empty blocks, just use them.
            if (this.getTotalDamageBlocks() < this.maxHealth()) {
                this.bashingDamage++;
                return;
            }

            // If there is already bashing damage, upgrade to lethal
            if (this.bashingDamage > 0) {
                this.bashingDamage--;
                this.lethalDamage++;
                return;
            }

            // If there is already lethal damage, upgrade to aggravated.
            if (this.lethalDamage > 0) {
                this.lethalDamage--;
                this.aggravatedDamage++;
                return;
            }

            // By this stage, they should be dead.
        };

        this.addLeathalDamage = function() {
            // Don't bother once they are dead.  You're literally flogging a dead character.
            if (this.isDead()) return;

            // If there are empty blocks, just use them.
            if (this.getTotalDamageBlocks() < this.maxHealth()) {
                this.lethalDamage++;
                return;
            }

            // If there is already bashing damage, upgrade to lethal
            if (this.bashingDamage > 0) {
                this.bashingDamage--;
                this.lethalDamage++;
                return;
            }

            // If there is already lethal damage, upgrade to aggravated.
            if (this.lethalDamage > 0) {
                this.lethalDamage--;
                this.aggravatedDamage++;
                return;
            }

            // By this stage, they should be dead.
        };

        this.addAggravatedDamage = function() {
            // Don't bother once they are dead.  You're literally flogging a dead character.
            if (this.isDead()) return;

            // If there are empty blocks, just use them.
            if (this.getTotalDamageBlocks() < this.maxHealth()) {
                this.aggravatedDamage++;
                return;
            }

            // If there is already bashing damage, upgrade to aggravated
            if (this.bashingDamage > 0) {
                this.bashingDamage--;
                this.aggravatedDamage++;
                return;
            }

            // If there is already lethal damage, upgrade to aggravated.
            if (this.lethalDamage > 0) {
                this.lethalDamage--;
                this.aggravatedDamage++;
                return;
            }

            // By this stage, they're dead.
        };

        this.healDamage = function(type, amount) {
            switch (type) {
                case 'A':
                    this.aggravatedDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.aggravatedDamage - amount));
                    break;
                case 'L':
                    this.lethalDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.lethalDamage - amount));
                    break;
                case 'B':
                    this.bashingDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.bashingDamage - amount));
                    break;
            }
        };

        this.initialize(character);
    }

    return Character;
});