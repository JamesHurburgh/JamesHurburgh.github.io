define(['app/dicer'],
    function(dicer) {

        const { test } = QUnit;
        QUnit.module( "Dicer Tests" );

        test("Qunit functioning - Dicer", function(assert) {
            assert.ok(true, "Passed!");
        });

        function functionProducesAllValuesInList(func, list, iterations, assert){
            var results = [];

            // Run the function 'iterations' times
            for(var i = 0; i < iterations; i++){
                var output = func();
                // Make sure each result is in the expected list
                assert.ok(list.indexOf(output) != -1, "'" + output + "' exists in list: " + list.toString());
                // Capture the expected results
                results.push(output);
            }

            // Make sure element in the expected results list is represented in the actual results at least once.
            list.forEach(function(element) {
                assert.ok(results.indexOf(element) != -1, "'" + element + "' exists in list: " + results.toString());
            }, this);
        }

        test("dicer.chooseRandom from list returns value from list", function(assert) {
            var list = [0,1,2,3,4,5,6,7,8,9];
            functionProducesAllValuesInList(
                function(){
                    return dicer.chooseRandom(list);
                }, 
                list, 
                1000, 
                assert);
        });

        test("dicer.roll returns value in list", function(assert) {
            
            functionProducesAllValuesInList(
                function(){
                    return dicer.roll(4, 4);
                }, 
                [4,5,6,7,8,9,10,11,12,13,14,15,16], 
                1000, 
                assert);

        });

        test("dicer.parseSingleRoll returns value in list", function(assert) {
            
            functionProducesAllValuesInList(
                function(){
                    return dicer.parseSingleRoll("4d4");
                }, 
                [4,5,6,7,8,9,10,11,12,13,14,15,16], 
                1000, 
                assert);

            functionProducesAllValuesInList(
                function(){
                    return dicer.parseSingleRoll("d4");
                }, 
                [1,2,3,4], 
                1000, 
                assert);
            
        });

        test("dicer.parseRollString returns value in list", function(assert) {
                       
            var rolls = [
                ["d4+0", [1,2,3,4]],
                ["1d4+0",[1,2,3,4]],
                ["2d4+0",[2,3,4,5,6,7,8]],
                ["d4+1",[2,3,4,5]],
                ["1d4+1",[2,3,4,5]],
                ["2d4+1",[3,4,5,6,7,8,9]],
                ["1d4+d4",[2,3,4,5,6,7,8]],
                ["1d4+1d4",[2,3,4,5,6,7,8]],
                ["2d3+2d3",[4,5,6,7,8,9,10,11,12]],
                ["1d4+d4+1",[3,4,5,6,7,8,9]],
                ["1d4+1d4+1",[3,4,5,6,7,8,9]],
                ["2d3+2d3+1",[5,6,7,8,9,10,11,12,13]],
                ];

            rolls.forEach(function(roll) {
                functionProducesAllValuesInList(
                    function(){
                        return dicer.parseRollString(roll[0]);
                    },
                    roll[1], 
                    1000, 
                    assert);
            }, this);            
        });

        /*
        TO TEST
        getRollsFromString : function(rollString) {
        getRollFromString : function(rollString) {
        parseRollString : function(rollString) {
    
    
        */


        test("dicer.shuffle contains all elements", function(assert){
            var list = [0,1,2,3,4,5,6,7,8,9];
            var results = dicer.shuffle(list);

            assert.equal(list.length, results.length, "Original list length is the same as the shuffled list length");
            list.forEach(function(element) {
                assert.ok(results.indexOf(element) != -1, "'" + element + "' exists in list: " + results.toString());
            }, this);
        });

        test("dicer.getMinRoll gets lowest value", function(assert){

            var rolls = [
                ["d10+0",1],
                ["1d10+0",1],
                ["2d10+0",2],
                ["100d10+0",100],
                ["d10+1",2],
                ["1d10+1",2],
                ["2d10+1",3],
                ["100d10+1",101],
                ["1d10+d10",2],
                ["1d10+1d10",2],
                ["2d10+2d10",4],
                ["100d10+100d10",200],
                ["1d10+d10+1",3],
                ["1d10+1d10+1",3],
                ["2d10+2d10+1",5],
                ["100d10+100d10+1",201],
                ];

            rolls.forEach(function(roll) {
                assert.equal(dicer.getMinRoll(roll[0]), roll[1], roll[0] + " min roll is " + roll[1]);    
            }, this);            
        });

        test("dicer.getMinRollFromSingleRoll gets lowest value", function(assert){

            var rolls = [
                ["d4",1],
                ["1d4",1],
                ["2d4",2],
                ["100d4",100],
                ["1d10",1],
                ["2d10",2],
                ["100d10",100]
                ];

            rolls.forEach(function(roll) {
                assert.equal(dicer.getMinFromSingleRoll(roll[0]), roll[1], roll[0] + " min roll is " + roll[1]);    
            }, this);            
        });

        test("dicer.getMaxRoll gets highest value", function(assert){

            var rolls = [
                ["d10+0",10],
                ["1d10+0",10],
                ["2d10+0",20],
                ["100d10+0",1000],
                ["d10+1",11],
                ["1d10+1",11],
                ["2d10+1",21],
                ["100d10+1",1001],
                ["d10+1d10",20],
                ["1d10+1d10",20],
                ["2d10+2d10",40],
                ["100d10+100d10",2000],
                ["d10+1d10+1",21],
                ["1d10+1d10+1",21],
                ["2d10+2d10+1",41],
                ["100d10+100d10+1",2001],
                ];

            rolls.forEach(function(roll) {
                assert.equal(dicer.getMaxRoll(roll[0]), roll[1], roll[0] + " min roll is " + roll[1]);    
            }, this);            
        });

        test("dicer.getMaxRollFromSingleRoll gets highest value", function(assert){

            var rolls = [
                ["d4",4],
                ["1d4",4],
                ["2d4",8],
                ["100d4",400],
                ["1d10",10],
                ["2d10",20],
                ["100d10",1000],
                ];

            rolls.forEach(function(roll) {
                assert.equal(dicer.getMaxFromSingleRoll(roll[0]), roll[1], roll[0] + " min roll is " + roll[1]);    
            }, this);            
        });
    });