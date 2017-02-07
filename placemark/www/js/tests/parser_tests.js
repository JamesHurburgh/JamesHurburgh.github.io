define(['jquery', 'alertify', 'store', 'mousetrap', 'showdown', 'app/parser', 'models/RollTableRow', 'models/RollTable'],
function($, alertify, store, mousetrap, showdown, parser, RollTableRow, RollTable) {

        QUnit.module('Parser Tests');

        QUnit.test("Qunit functioning - Parser", function(assert) {
            assert.ok(true, "Passed!");
        });

        QUnit.test("parser.parseSingleTable  One blank option returns no table", function(assert) {

            var table = parser.parseSingleTable("Table::");
            //assert.expect(0);
            assert.ok(!table, "No table returned")
                // assert.ok(table.rollDictionary.length == 1, "Roll dictionary has one entry");
                // assert.ok(table.rollDictionary[0] == "", "Roll dictionary entry is empty string");

        });

        QUnit.test("parser.parseSingleTable One option", function(assert) {

            var table = parser.parseSingleTable("One option::Option 1");
            assert.equal(table.rollDictionary.length, 1, "Roll dictionary has one entry");
            assert.equal(table.rollDictionary[0], "Option 1", "Roll dictionary entry is correct");

        });
        // One option:
        // # Option 1

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

        QUnit.test("RollTableRow creation", function(assert) {
            assert.expect(3);
            var row = new RollTableRow();
            row.min = 1;
            row.max = 1;
            row.output = "Test";
            assert.equal(row.min, 1);
            assert.equal(row.max, 1);
            assert.equal(row.output, "Test");
        });

    });