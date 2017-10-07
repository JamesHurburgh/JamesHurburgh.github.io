/*jshint esversion: 6 */

define([],
    function CommonFunctions() {

        return function CommonFunctions() {

            function uuidv4() {
                return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                );
            }
            this.uuidv4 = uuidv4;

            function clone(object) {
                try {
                    return JSON.parse(JSON.stringify(object));
                } catch (exception) {
                    console.log("Unable to parse object: " + JSON.stringify(object));
                }
            }
            this.clone = clone;

            function varyAmount(amount) {
                return Math.floor(amount * (Math.random() + 0.5));
            }
            this.varyAmount = varyAmount;

            function nth(d) {
                if (d > 3 && d < 21) return 'th'; // thanks kennebec
                switch (d % 10) {
                    case 1:
                        return "st";
                    case 2:
                        return "nd";
                    case 3:
                        return "rd";
                    default:
                        return "th";
                }
            }
            this.nth = nth;
        };

    }
);