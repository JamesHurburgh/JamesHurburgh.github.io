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
requirejs(['vue', 'jquery', 'store', 'showdown', 'app/parser', 'app/dicer'],
    function(Vue, $, store, showdown, parser, dicer) {

        var version = "0.1";


        // Initialise stored placemarks
        var placeMarkData = store.get('placeMarkData');
        if (!placeMarkData || placeMarkData === undefined) {
            placeMarkData = {
                version: version,
                scripts: []
            };
            // TODO Load the documentation
        }

        // Load the first one
        var placemark = placeMarkData.scripts[0];

        if (!placemark || placemark === null || placemark === undefined) {
            placemark = {
                title: "Welcome to PlaceMark",
                script: "#Welcome to PlaceMark\n\nThis {awesome|fantastic|terrific|splendiferous} {website|webpage|online tool|magic portal} {helps|assists|just gets stuff done} {creating|making|assembling} {random|natural|funky} {output|text|sentences|works of art}.\n\nThis is done by transforming PlaceMark script, which is {what you see|} in the text area above. It allows you to write natural sentences with placeamrks where you would like to include random words. This is done by using double curly braces {placeholder} with a list of possible {words or phrases|phrases or words} to use seperated by the bar \"|\" character. When the text is transformed a random option will be chosen from each PlaceMark. It's that simple!\n\nThe {magic internet navigation buttons|links} {on the right|on the starboard side of your browser|over there -->} (once they exist) will be all of your available PlaceMark Scripts. Right now I've (got the intention to) put a bunch of helpful tutorials that will help you familiarise yourself with the interface and get you started making your own fantastic PlaceMark Scripts.\n\nThe {results are|output is} {parsed|transformed} as [Markdown](https://en.wikipedia.org/wiki/Markdown) {for your convinience|so you don't have to}.\n\n\n\n",
                options: {
                    showTables: false,
                    showMarkup: true,
                    showRaw: false,
                    autoParse: true,
                    generateCount: 1
                }
            };
        }

        // TODO Do I need to initialise this?
        Vue.component('placemark-template', {
            props: ['placemark'],
            template: '#placemark-template',
            computed: {},
            components: {},
            methods: {
                load: function(event) {
                    placemarkEditor.placemark = this.placemark;
                }
            }
        });

        var placemarkEditor = new Vue({
            el: '#placemarkEditor',
            data: {
                placemark: placemark,
                transformation: ""
            },
            computed: {
                parsed: function() {
                    var results = "";
                    for (var i = 0; i < this.placemark.options.generateCount; i++) {
                        results += parser.parse(this.placemark.script);
                    }
                    // this.placemark.parsedResult = results;
                    return results;
                },
                parsedMarkup: function() {
                    return new showdown.Converter().makeHtml(this.transformation);
                },
            },
            methods: {
                transform: function(event) {
                    var results = "";
                    parser.setScriptList(placeMarkData.scripts);
                    for (var i = 0; i < this.placemark.options.generateCount; i++) {
                        results += parser.parse(this.placemark.script);
                    }
                    this.transformation = results;
                },
                save: function(event) {
                    var index = -1;
                    for (var i = 0; i < placeMarkData.scripts.length; i++) {
                        if (placeMarkData.scripts[i].title === this.placemark.title) {
                            index = i;
                        }
                    }
                    if (index === -1) {
                        placeMarkData.scripts.push(this.placemark);
                        store.set('placeMarkData', placeMarkData);
                    } else {
                        if (confirm("Overwrite '" + this.placemark.title + "'?")) {
                            placeMarkData.scripts[index] = this.placemark;
                            store.set('placeMarkData', placeMarkData);
                        }
                    }
                },
                exportScript: function(event) {
                    var text = encodeURIComponent(JSON.stringify(this.placemark));
                    var data = "data:text/json;charset=utf-8," + text;

                    var hf = document.createElement('a');

                    hf.href = data;
                    hf.download = this.placemark.title + '.placemark';
                    hf.innerHTML = hf.download;
                    document.getElementsByTagName("body")[0].appendChild(hf);
                    hf.click();
                    document.getElementsByTagName("body")[0].removeChild(hf);
                },
                deleteScript: function(event) {
                    if (confirm("Are you sure you want to delete '" + this.placemark.title + "' forever?")) {

                        for (var i = 0; i < placeMarkData.scripts.length; i++) {
                            if (placeMarkData.scripts[i].title === this.placemark.title) {
                                placeMarkData.scripts.splice(i, 1);
                            }
                        }
                        store.set('placeMarkData', placeMarkData);
                    };

                }
            },
        });

        var placemarkManager = new Vue({
            el: '#placemarkManager',
            data: placeMarkData,
            computed: {},
            methods: {
                newScript: function(event) {
                    placemarkEditor.placemark = {
                        title: "New PlaceMark",
                        script: "",
                        options: {
                            showTables: false,
                            showMarkup: true,
                            showRaw: false,
                            autoParse: true,
                            generateCount: 1
                        }
                    };
                    placemarkEditor.transformation = "";
                },
                triggerImport: function(event) {
                    this.$refs.fileInput.click();
                },
                importScript: function(event) {
                    alert("import");
                    if (!window.FileReader) {
                        alert('Your browser is not supported');
                        return false;
                    }
                    var input = event.target;

                    // Create a reader object
                    var reader = new FileReader();
                    if (input.files.length) {
                        var textFile = input.files[0];
                        // Read the file
                        reader.readAsText(textFile);
                        // When it's loaded, process it
                        reader.onload = function(e) {
                            var newPlacemark = JSON.parse(reader.result);
                            placeMarkData.scripts.push(newPlacemark);
                        };
                    } else {
                        alert('Please upload a file before continuing');
                    }
                }
            },
        });

    }
);