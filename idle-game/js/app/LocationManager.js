/*jshint esversion: 6 */

define(["json!data/locations.json"],
    function LocationManager(locations) {

        function uuidv4() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }

        function clone(object) {
            try {
                return JSON.parse(JSON.stringify(object));
            } catch (exception) {
                console.log("Unable to parse object: " + JSON.stringify(object));
            }
        }

        function varyAmount(amount) {
            return Math.floor(amount * (Math.random() + 0.5));
        }

        return function LocationManager(gameState) {

            this.gameState = gameState;

            this.getLocation = function(name) {
                return locations.filter(location => location.name == name)[0];
            };

            this.getCurrentLocation = function() {
                return this.getLocation(gameState.location.name);
            };

            this.setCurrentLocation = function(name) {
                gameState.location = this.getLocation(name);
            };

            // Locations
            this.currentLocationIndex = function() {
                return locations.indexOf(locations.filter(location => location.name == gameState.location.name)[0]);
            };

            this.canRelocateDown = function() {
                return this.currentLocationIndex() > 0;
            };

            this.relocateDown = function() {
                if (this.canRelocateDown()) {
                    gameState.location = locations[this.currentLocationIndex() - 1];
                    if (!gameState.location.availableContracts) gameState.location.availableContracts = [];
                    if (!gameState.location.availableHires) gameState.location.availableHires = [];
                    gameState.expireAllExpired();
                    gameState.trackStat("relocate-to", gameState.location.name, 1);
                }
            };

            this.canRelocateUp = function() {
                // This is the hard limit for now.
                if (gameState.location.disabled !== undefined && gameState.location.disabled) {
                    return false;
                }
                if (this.currentLocationIndex() == locations.length - 1) {
                    return false;
                }
                var newLocation = locations[this.currentLocationIndex() + 1];
                return newLocation.renownRequired <= gameState.renown;
            };

            this.relocateUp = function() {
                if (this.canRelocateUp()) {
                    gameState.location = locations[this.currentLocationIndex() + 1];
                    if (!gameState.location.availableContracts) gameState.location.availableContracts = [];
                    if (!gameState.location.availableHires) gameState.location.availableHires = [];
                    gameState.expireAllExpired();
                    gameState.trackStat("relocate-to", gameState.location.name, 1);
                }
            };

        };

    }
);