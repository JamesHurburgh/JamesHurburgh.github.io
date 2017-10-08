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
    function($, Vue, alertify, store, chance, AdventurersGame) {

        // extend jQuery to add a function that does it all for you
        // See: https://github.com/daneden/animate.css
        $.fn.extend({
            animateCss: function(animationName) {
                var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
                this.addClass('animated ' + animationName).one(animationEnd, function() {
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

        function save() {
            if (controller) {
                store.set("AdventurersGame", controller._data);
            }
        }

        var AdventurersGame = new AdventurersGame(store.get("AdventurersGame"), save);

        var controller = new Vue({
            el: '#AdventurersGame',
            data: AdventurersGame,
            computed: {},
            methods: {},
            // created: alert("created"),
            // ready: alert("ready"),
            mounted: function() {
                this.$nextTick(function() {});
            }
        });

        function tick() {
            try {
                AdventurersGame.tick();
            } catch (exception) {
                console.log(exception);
            }
            setTimeout(tick, 100);
        }
        // boot up the first call
        tick();

    });