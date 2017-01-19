define(['jquery', 'alertify', 'store', 'mousetrap', 'showdown', 'app/parser', 'models/RollTableRow', 'models/RollTable'],
function($, alertify, store, mousetrap, showdown, parser, RollTableRow, RollTable) {

        QUnit.module('Parser Tests');

        QUnit.test("Qunit functioning - Parser", function(assert) {
            assert.ok(true, "Passed!");
        });

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