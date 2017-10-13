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
requirejs(['jquery', 'vue', 'alertify', 'store', 'chance', 'app/AdventurersGame'],
    function ($, Vue, alertify, store, chance, AdventurersGame) {

        // extend jQuery to add a function that does it all for you
        // See: https://github.com/daneden/animate.css
        $.fn.extend({
            animateCss: function (animationName) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                this.addClass('animated ' + animationName).one(animationEnd, function () {
                    $(this).removeClass('animated ' + animationName);
                });
                return this;
            }
        });

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function save(gameState) {
            if (gameState) {
                store.set("AdventurersGame", gameState);
            }
        }

        function handleException(ex) {
            $("#AdventurersGame").hide();
            log(ex);
            log(ex.stack);
            log(JSON.stringify(AdventurersGame));
            $("#log").show();
        }

        function log(message) {
            console.log(message);
            $("#log").append($("<div>").append(Date.now().toString() + ": " + message));
        }


        Vue.config.errorHandler = function (err, vm, info) {
            handleException(err);
        };

        var adventurersGame;

        try {
            adventurersGame = new AdventurersGame(store.get("AdventurersGame"), save, log);

            var controller = new Vue({
                el: '#AdventurersGame',
                data: adventurersGame,
                computed: {},
                methods: {},
                // created: alert("created"),
                // ready: alert("ready"),
            });
        } catch (ex) {
            handleException(ex);
        }

        function tick() {
            try {
                adventurersGame.minorTick();
                setTimeout(tick, 100);
            } catch (ex) {
                handleException(ex);
            }
        }
        // boot up the first call
        tick();

    });