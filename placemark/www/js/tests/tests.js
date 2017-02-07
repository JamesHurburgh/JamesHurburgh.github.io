requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
        models: '../app/models',
        tests: '../tests'
    }
});

requirejs([
    'tests/dicer_tests', 
    'tests/parser_tests', 
    'tests/RollTable_tests'],
    function(
        dicer_tests, 
        parser_tests, 
        RollTable_tests) {});