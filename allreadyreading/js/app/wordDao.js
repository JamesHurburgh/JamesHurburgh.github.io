define(["jquery"],
    function($) {
        return {
            getSetNames: function() {
                return $.getJSON("./js/app/data/sets.json", function(data) {
                    var items = [];
                    data.sets.forEach(function(element) {
                        items.push(element.setName);
                    }, this);
                    return items;
                });
            },

            getSet: function(setName) {
                return this.getSetNames().then(function(setNames) {
                    var selectedSet = null;
                    setNames.sets.forEach(function(set) {
                        if (set.setName === setName) {
                            selectedSet = set;
                        }
                    });
                    return selectedSet;
                });
            },

            getWordListNames: function(setName) {
                return this.getSet(setName).then(function (set){
                    return $.getJSON("./js/app/data/word-sets/" + set.fileName, function(data) {
                        var items = [];
                        $.each(data, function(key, val) {
                            items.push(val.setName);
                        });
                        return items;
                    });
                });
            },

            getWordList: function(setName, wordListName) {
                var wordList = null;

                return wordList;
            }
        };
    }
);