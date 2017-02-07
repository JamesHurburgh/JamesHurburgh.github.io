define(['jquery', 'alertify', 'store', 'mousetrap', 'showdown', 'app/parser', 'models/RollTableRow', 'models/RollTable'],
function($, alertify, store, mousetrap, showdown, parser, RollTableRow, RollTable) {

        QUnit.module('RollTable Tests');

        QUnit.test("Qunit functioning - RollTable", function(assert) {
            assert.ok(true, "Passed!");
        });

        QUnit.test("RollTable creation - Generic", function(assert) {
            assert.expect(2);
            var table = new RollTable();
            table.name = "Table";
            table.roll = "2d6";
            assert.equal(table.name, "Table");
            assert.equal(table.roll, "2d6");
        });

        QUnit.test("RollTable.parse One Blank Option:", function(assert) {
            var table = new RollTable();
            table.parse("One Blank Option:")
            
            assert.expect(5);
            assert.equal(table.name, "One Blank Option");
            assert.equal(table.roll, "1d1");
            assert.true(table.rollDictionary);
            assert.equal(table.rollDictionary.length, 1);
            assert.equal(table.rollDictionary[0].output, "");

        });

        QUnit.test("RollTable.parse One option:", function(assert) {
            var table = new RollTable();
            table.parse("One option:\n"+
                        "# Option 1");
            assert.equal(table.name, "One option");
            assert.equal(table.roll, "1d1");
            assert.true(table.rollDictionary);
            assert.equal(table.rollDictionary.length, 1);
            assert.equal(table.rollDictionary[0].output, "Option 1");
        });

        QUnit.test("RollTable.parse Two options:", function(assert) {
            var table = new RollTable();
            table.parse("Two option:\n"+
                        "# Option 1\n"+
                        "# Option 2");
            assert.equal(table.name, "One option");
            assert.equal(table.roll, "1d2");
            assert.true(table.rollDictionary);
            assert.equal(table.rollDictionary.length, 2);
            assert.equal(table.rollDictionary[0].output, "Option 1");
            assert.equal(table.rollDictionary[1].output, "Option 2");
        });



// Two options:
// # Option 1
// # Option 2

// Three options:
// # Option 1
// # Option 2
// # Option 3

// One Numbered Option
// 1: Option 1

// Two Numbered Options
// 1: Option 1
// 2: Option 2

// Three Number Options
// 1: Option 1
// 2: Option 2
// 3: Option 3

// One option with a number range:
// [1-100] The only option

// Two options with number ranges:
// [1-2] Unlikely option
// [3-100] Likely option

// Some numbers and ranges:
// [1] Numbered option
// [9-10] Ranged option

// Multiline options:
// # This option goes
// across multiple lines
// # This option also goes

// across
    });