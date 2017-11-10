define([
    'json!data/attributes.json',
    'json!data/skills.json',
    'json!data/arcana.json'
], function(
    attributes,
    skills,
    arcana) {

    console.log("Initialising Character definition");

    // This is specificallly a Mage the Awakening Character
    function Character(character) {

        this.initialize = function(character) {

            console.log("Creating Character");

            if (character) {
                for (var property in character) {
                    if (character.hasOwnProperty(property)) {
                        this[property] = character[property];
                    }
                }
            } else {

                this.name = "";
                this.age = 0;
                this.player = "Your name here";
                this.chronicle = "";
                this.concept = "";
                this.virtue = "";
                this.vice = "";

                // Skills
                skills.forEach(function(skill) {
                    this[skill.name.toLowerCase()] = 0;
                }, this);

                // Attributes
                attributes.forEach(function(attribute) {
                    this[attribute.name.toLowerCase()] = 1;
                }, this);

                // Aracana
                arcana.forEach(function(arcanum) {
                    this[arcanum.name.toLowerCase()] = 0;
                }, this);

                this.flaws = [];
                this.merits = [];
                this.derangements = [];

                this.size = 5;
                this.gnosis = 1;
                this.wisdom = 7;
                this.experience = 0;

                // Starting Values
                this.bashingDamage = 0;
                this.lethalDamage = 0;
                this.aggravatedDamage = 0;
                this.willpower = this.maxWillpower();
                this.mana = this.wisdom;

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