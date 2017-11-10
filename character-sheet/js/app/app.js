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
        data: '../../data',
    }
});

// Start the main app logic.
requirejs(['jquery', 'vue', 'app/CharacterEditor'],
    function ($, Vue, CharacterEditor) {

        var characterEditor = new CharacterEditor();

        var controller = new Vue({
            el: '#app',
            data: characterEditor,
            computed: {
            },
            methods: {
                openFile: function (event) {
                    this.loadFromFile(event);
                }
            },
            mounted: function () {
                $("#splashPage").hide();
                $("#app").show();
            }
        });
    });