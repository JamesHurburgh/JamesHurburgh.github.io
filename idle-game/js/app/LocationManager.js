/*jshint esversion: 6 */

define([
        "app/CommonFunctions",
        "app/DataManager"
    ],
    function LocationManager(
        CommonFunctions,
        DataManager) {

        return function LocationManager(gameController, gameState) {

            this.gameState = gameState;
            this.gameController = gameController;

            this.getJobContractsAtCurrentLocation = function() {
                return this.getJobContractsAtLocation(this.getCurrentLocation());
            };

            this.getJobContractsAtLocation = function(location) {
                if (!location.availableContracts) location.availableContracts = [];
                return location.availableContracts.length;
            };

            this.getAdventurerContractsAtCurrentLocation = function() {
                return this.getAdventurerContractsAtLocation(this.getCurrentLocation());
            };

            this.getAdventurerContractsAtLocation = function(location) {
                if (!location.availableAdventurers) location.availableAdventurers = [];
                return location.availableAdventurers.length;
            };

            this.getLocation = function(name) {
                return data.locations.filter(location => location.name == name)[0];
            };

            this.getLocationList = function() {
                if (!this.gameState.locationList) this.gameState.locationList = common.clone(data.locations);
                return this.gameState.locationList;
            };

            this.getCurrentLocation = function() {
                if (!this.gameState.location) this.gameState.location = this.getLocationList()[0];
                return this.gameState.location;
            };

            this.setCurrentLocation = function(name) {
                this.gameState.location = this.getLocation(name);
            };

            // Locations
            this.currentLocationIndex = function() {
                return data.locations.indexOf(data.locations.filter(location => location.name == this.gameState.location.name)[0]);
            };

            this.canRelocateDown = function() {
                return this.currentLocationIndex() > 0;
            };

            this.relocateDown = function() {
                var locations = this.getLocationList();
                if (this.canRelocateDown()) {
                    this.gameState.location = locations[this.currentLocationIndex() - 1];
                    this.gameController.StatisticsManager().trackStat("relocate-to", this.gameState.location.name, 1);
                }
            };

            this.canRelocateUp = function() {
                // This is the hard limit for now.
                if (this.gameState.location.disabled !== undefined && this.gameState.location.disabled) {
                    return false;
                }
                if (this.currentLocationIndex() == data.locations.length - 1) {
                    return false;
                }
                var newLocation = data.locations[this.currentLocationIndex() + 1];
                return newLocation.renownRequired <= this.gameState.renown;
            };

            this.relocateUp = function() {
                var locations = this.getLocationList();
                if (this.canRelocateUp()) {
                    this.gameState.location = locations[this.currentLocationIndex() + 1];
                    this.gameController.StatisticsManager().trackStat("relocate-to", this.gameState.location.name, 1);
                }
            };

        };

    }
);