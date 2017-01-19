define(["models/RollTableRow"], function RollTable(RollTableRow) {
    return (function () {
        var RollTable = (function () {
            function RollTable() {
            }
            RollTable.prototype.parse = function (parseString) {
                this.name = parseString;
            };
            return RollTable;
        }());
    });
});
