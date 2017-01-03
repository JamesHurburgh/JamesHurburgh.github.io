requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app'
    }
});

// Start the main app logic.
requirejs(['jquery', 'alertify', 'store', 'mousetrap','showdown'],
function   ($,        alertify,   store, mousetrap, showdown) {

    initStorejs();

    function initStorejs() {
        if (!store.enabled) {
            alert('Local storage is not supported by your browser. Please disable "Private Mode", or upgrade to a modern browser.')
            return
        }
    }

    alertify.alert("hello world");

});