/*jshint esversion: 6 */
define([
    'json!data/attributes.json',
    'json!data/skills.json',
    'json!data/arcana.json',
    'json!data/gnosis.json'
], function (
    attributes,
    skills,
    arcana,
    gnosis) {

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
            { "key": "logs", "value": [] },
            { "key": "editMode", "value": "free" },

            { "key": "size", "value": 5 },
            { "key": "gnosis", "value": 1 },
            { "key": "wisdom", "value": 7 },
            { "key": "experience", "value": 0 },
            { "key": "cabalExperience", "value": 0 },
            { "key": "arcaneExperience", "value": 0 },

            { "key": "bashingDamage", "value": 0 },
            { "key": "lethalDamage", "value": 0 },
            { "key": "aggravatedDamage", "value": 0 },

            { "key": "flaws", "value": [] },
            { "key": "merits", "value": [] },
            { "key": "derangements", "value": [] },
            { "key": "activeSpells", "value": [] },
            { "key": "inventory", "value": [] },
            { "key": "specialties", "value": {} },

        ];

        // Skills
        skills.forEach(function (skill) {
            defaults.push({ "key": skill.name.toLowerCase(), "value": 0 });
        }, this);

        // Attributes
        attributes.forEach(function (attribute) {
            defaults.push({ "key": attribute.name.toLowerCase(), "value": 1 });
        }, this);

        // Arcana
        arcana.forEach(function (arcanum) {
            defaults.push({ "key": arcanum.name.toLowerCase(), "value": 0 });
        }, this);


        // This is specificallly a Mage the Awakening Character
        function Character(character) {

            this.initialize = function (character) {

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
                defaults.forEach(function (de) {
                    this.initialiseField(de.key, de.value, newCharacter);
                }, this);

                // Starting Values
                this.initialiseField('willpower', this.maxWillpower(), newCharacter);
                this.initialiseField('mana', this.wisdom, newCharacter);

            };

            this.initialiseField = function (fieldName, defaultValue, newCharacter) {
                if (!this[fieldName]) {
                    this[fieldName] = defaultValue;
                    if (!newCharacter) {
                        console.log("Initialising field on established character: " + fieldName);
                    }
                }
            };

            // Strength
            this.carryingCapacity = function () {

                return this.strength * 25 + "lbs (" + this.strength * 11.4 + "kg)";
            };

            // Willpower
            this.maxWillpower = function () {
                return this.resolve + this.composure;
            };

            this.adjustWillpower = function (amount) {
                this.logUpdate("willpower", () =>
                    this.willpower = Math.min(this.maxMana(), Math.max(this.willpower + amount, 0))
                );
            };

            // Mana
            this.maxMana = function () {
                return this.getGnosisData(this.gnosis).maxMana;
            };

            this.maxManaPerTurn = function () {
                return this.getGnosisData(this.gnosis).maxManaPerTurn;
            };

            this.adjustMana = function (amount) {
                this.logUpdate("mana", () =>
                    this.mana = Math.min(this.maxMana(), Math.max(this.mana + amount, 0))
                );
            };

            // Gnosis
            this.adjustGnosis = function (amount) {
                this.logUpdate("gnosis", () =>
                    this.gnosis = Math.min(10, Math.max(this.gnosis + amount, 1))
                );
            };

            this.maxActiveSpells = function () {
                return this.gnosis + 3;
            };

            this.getGnosisData = function (gnosisLevel) {
                return gnosis.filter(g => g.level == gnosisLevel)[0];
            };

            this.physicalLimit = function () {
                return this.getGnosisData(this.gnosis).physicalLimit;
            };

            this.spellTolerance = function () {
                return this.stamina;
            };

            this.spellAccumulationPenalty = function () {
                // TODO define
                return 0;
            };

            // Defense
            this.defense = function () {
                return Math.min(this.dexterity, this.wits);
            };

            this.initiativeMod = function () {
                return this.dexterity + this.composure;
            };

            this.speed = function () {
                return this.dexterity + this.strength + 5;
            };

            this.updateSkillSpecialty = function (skill, value) {
                var before = this.specialties[skill];
                this.specialties[skill] = value;
                var after = this.specialties[skill];
                this.log(skill + "-specialty", before, after);
            };

            // Notes
            this.updateNotes = function (newValue) {
                this.logUpdate("notes", () => this.notes = newValue);
            };

            // Logging
            this.log = function (field, oldValue, newValue) {
                if (this.logs.length > 0 && this.logs[this.logs.length - 1].field == field) {
                    this.logs[this.logs.length - 1].newValue = newValue;
                    this.logs[this.logs.length - 1].time = Date.now();
                } else {
                    this.logs.push({
                        "editMode": this.editMode,
                        "field": field,
                        "oldValue": oldValue,
                        "newValue": newValue,
                        "time": Date.now()
                    });
                }
            };

            this.logUpdate = function (fieldName, func) {
                var before = this[fieldName];
                func();
                var after = this[fieldName];
                this.log(fieldName, before, after);
            };

            // Damage and Health
            this.maxHealth = function () {
                return this.size + this.stamina;
            };

            this.getTotalDamageBlocks = function () {
                return this.bashingDamage + this.lethalDamage + this.aggravatedDamage;
            };

            this.isDead = function () {
                return this.aggravatedDamage >= this.maxHealth();
            };

            this.addBashingDamage = function () {

                // Don't bother once they are dead.  You're literally flogging a dead character.
                if (this.isDead()) return;

                // If there are empty blocks, just use them.
                if (this.getTotalDamageBlocks() < this.maxHealth()) {
                    this.logUpdate("bashingDamage", () => this.bashingDamage++);
                    return;
                }

                // If there is already bashing damage, upgrade to lethal
                if (this.bashingDamage > 0) {
                    this.logUpdate("bashingDamage", () => this.bashingDamage--);
                    this.logUpdate("lethalDamage", () => this.lethalDamage++);
                    return;
                }

                // If there is already lethal damage, upgrade to aggravated.
                if (this.lethalDamage > 0) {
                    this.logUpdate("lethalDamage", () => this.lethalDamage--);
                    this.logUpdate("aggravatedDamage", () => this.aggravatedDamage++);
                    return;
                }

                // By this stage, they should be dead.
            };

            this.addLethalDamage = function () {
                // Don't bother once they are dead.  You're literally flogging a dead character.
                if (this.isDead()) return;

                // If there are empty blocks, just use them.
                if (this.getTotalDamageBlocks() < this.maxHealth()) {
                    this.logUpdate("lethalDamage", () => this.lethalDamage++);
                    return;
                }

                // If there is already bashing damage, upgrade to lethal
                if (this.bashingDamage > 0) {
                    this.logUpdate("bashingDamage", () => this.bashingDamage--);
                    this.logUpdate("lethalDamage", () => this.lethalDamage++);
                    return;
                }

                // If there is already lethal damage, upgrade to aggravated.
                if (this.lethalDamage > 0) {
                    this.logUpdate("lethalDamage", () => this.lethalDamage--);
                    this.logUpdate("aggravatedDamage", () => this.aggravatedDamage++);
                    return;
                }

                // By this stage, they should be dead.
            };

            this.addAggravatedDamage = function () {
                // Don't bother once they are dead.  You're literally flogging a dead character.
                if (this.isDead()) return;

                // If there are empty blocks, just use them.
                if (this.getTotalDamageBlocks() < this.maxHealth()) {
                    this.logUpdate("aggravatedDamage", () => this.aggravatedDamage++);
                    return;
                }

                // If there is already bashing damage, upgrade to aggravated
                if (this.bashingDamage > 0) {
                    this.logUpdate("bashingDamage", () => this.bashingDamage--);
                    this.logUpdate("aggravatedDamage", () => this.aggravatedDamage++);
                    return;
                }

                // If there is already lethal damage, upgrade to aggravated.
                if (this.lethalDamage > 0) {
                    this.logUpdate("lethalDamage", () => this.lethalDamage--);
                    this.logUpdate("aggravatedDamage", () => this.aggravatedDamage++);
                    return;
                }

                // By this stage, they're dead.
            };

            this.healDamage = function (type, amount) {

                switch (type) {
                    case 'A':
                        this.logUpdate("aggravatedDamage", () => this.aggravatedDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.aggravatedDamage - amount)));
                        break;
                    case 'L':
                        this.logUpdate("lethalDamage", () => this.lethalDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.lethalDamage - amount)));
                        break;
                    case 'B':
                        this.logUpdate("bashingDamage", () => this.bashingDamage = Math.min(this.getTotalDamageBlocks(), Math.max(0, this.bashingDamage - amount)));
                        break;
                }
            };

            this.initialize(character);
        }

        return Character;
    });