define(["models/RollTableRow"], function RollTable(RollTableRow) {
    return (function () {
      class RollTable {
        name: string;
        roll: string;
        // minRoll: dicer.getMinRoll(roll);
        // maxRoll: dicer.getMaxRoll(roll);
        rollDictionary: RollTableRow;

        parse(parseString: string){
            this.name = parseString;
        }
      }
    });
});