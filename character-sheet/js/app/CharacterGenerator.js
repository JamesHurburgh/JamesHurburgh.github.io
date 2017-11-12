define([
    "models/Character",
    "chance",
    'json!data/attributes.json',
    'json!data/skills.json',
    'json!data/virtues.json',
    'json!data/vices.json',
    'json!data/paths.json',
    'json!data/orders.json',
    'json!data/flaws.json',
    'json!data/merits.json',
    'json!data/arcana.json'
], function(
    Character,
    Chance,
    attributes,
    skills,
    virtues,
    vices,
    paths,
    orders,
    flaws,
    merits,
    arcana) {

    function CharacterGenerator() {
        console.log("Initialising CharacterGenerator definition");

        // methods
        this.initialize = function() {
            console.log("Creating CharacterGenerator");
        };

        this.generateRandomCharacter = function() {
            console.log("Generating random character");

            var character = new Character();
            character.gender = chance.gender();

            character.nameParts = {};
            character.nameParts.prefix = '';
            // character.nameParts.prefix = chance.prefix({ gender: character.gender });
            character.nameParts.first = chance.first({ gender: character.gender });
            character.nameParts.last = chance.last();
            character.nameParts.suffix = '';
            // character.nameParts.suffix = chance.suffix();

            character.name = (character.nameParts.prefix + ' ' + character.nameParts.first + ' ' + character.nameParts.last + ' ' + character.nameParts.suffix).trim();
            character.birthday = chance.birthday();
            character.countryOfBirth = chance.country({ full: true });
            character.age = Math.floor((Date.now() - character.birthday) / (1000 * 60 * 60 * 24 * 365));

            character.concept = chance.profession();

            character.cabal = chance.company();

            character.path = chance.pickone(paths).name;
            character.order = chance.pickone(orders).name;

            character.virtue = chance.pickone(virtues).name;
            character.vice = chance.pickone(vices).name;

            character.wisdom = chance.integer({ min: 1, max: 10 });

            // Starting Values
            character.bashingDamage = chance.integer({ min: 0, max: 2 });
            character.lethalDamage = chance.integer({ min: 0, max: 2 });
            character.aggravatedDamage = chance.integer({ min: 0, max: 2 });
            character.willpower = chance.integer({ min: 0, max: character.maxWillpower() });
            character.mana = chance.integer({ min: 0, max: character.maxMana() });

            character.derangements = [];

            character.flaws = chance.pickset(flaws, chance.integer({ min: 0, max: 2 })).map(function(flaw) {
                return {
                    name: flaw.name
                };
            });

            character.merits = chance.pickset(merits, chance.integer({ min: 0, max: 7 })).map(function(merit) {
                return {
                    name: merit.name,
                    dots: 1
                };
            });

            // Attributes
            attributes.forEach(function(attribute) {
                character[attribute.name.toLowerCase()] = chance.integer({ min: 1, max: 5 });
            }, this);

            // Skills
            skills.forEach(function(skill) {
                character[skill.name.toLowerCase()] = chance.integer({ min: 0, max: 5 });
                character[skill.name.toLowerCase()].specialities = chance.pickset(skill.specialties, chance.integer({ min: 0, max: 2 }));
            }, this);

            // Arcana
            arcana.forEach(function(arcanum) {
                character[arcanum.name.toLowerCase()] = chance.integer({ min: 0, max: 5 });
            }, this);


            return character;

        };

        // Initialise
        this.initialize();
    }

    return new CharacterGenerator();
});