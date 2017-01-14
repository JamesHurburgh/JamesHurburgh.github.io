define(['jquery', 'alertify', 'store', 'mousetrap', 'showdown', 'app/parser'],
    function($, alertify, store, mousetrap, showdown, parser) {

        QUnit.module('Parser Tests');

        QUnit.test("Qunit functioning - Parser", function(assert) {
            assert.ok(true, "Passed!");
        });

// One blank option:

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
    });