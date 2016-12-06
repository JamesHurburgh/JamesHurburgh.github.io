$(document).ready(function () {

    var size = 10;
    var buffer = 1;
    
    function renderXY(cell){
        cell.div.append(cell.data.row+","+cell.data.col);
    }
    function renderRand(cell){
        if(!(!cell) && !(!cell.div)){
        cell.div.append(cell.data.rand)};
    }
    function renderSmooth(cell){
        if(!(!cell) && !(!cell.div)){
        cell.div.append(cell.data.smooth)};
    }
    function getCell(row,col){
        if(!cells[row]){
            return;
        }
        return cells[row][col];
    }

    var cells = [];
    var table = $("<table>");
    var headerRow = $("<tr>");
    for(var colNum = 0-buffer; colNum < size+2*buffer; colNum++){
        headerRow.append($("<th>").append(colNum));
    }
    table.append(headerRow);
    
    for(var rowNum = 0-buffer; rowNum < size+2*buffer; rowNum++){
        var row = $("<tr>");
        cells[rowNum] = [];
        for(var colNum = 0-buffer; colNum < size+2*buffer; colNum++){

    var rand = Math.random();
            var data = {
                row:rowNum,
                col:colNum,
                rand:rand};

            var div = $("<div>");

            var cell = {div:div, data: data}; // Define a cell as a div
            cells[rowNum][colNum] = cell;
            row.append($("<td>").append(div));
        }
        table.append(row);
    }
    
    $("#procGenContainer").append(table);
    renderAllRand();


    function renderAllRand(){
        cells.forEach(function(cellrow) {
            cellrow.forEach(function(cell) {
                renderRand(cell);
            }, this);
        }, this);
    }
    $("#smoothButton").click(function(e){
        cells = smoothAll(cells);
        renderAllSmooth();
    });

    function smoothAll(cells){
        for(var rowNum = 0; rowNum < size; rowNum++){
            for(var colNum = 0; colNum < size; colNum++){
                var cellsToAverage = [
                    getCell(rowNum - 1, colNum - 1),
                    getCell(rowNum - 1, colNum),
                    getCell(rowNum - 1, colNum + 1),
                    getCell(rowNum, colNum - 1),
                    getCell(rowNum, colNum),
                    getCell(rowNum, colNum + 1),
                    getCell(rowNum + 1, colNum - 1),
                    getCell(rowNum + 1, colNum),
                    getCell(rowNum + 1, colNum + 1)
                    ];
                var total = 0;
                var count = 0;
                for(var i = 0; i < cellsToAverage.length; i++){
                    if(!cellsToAverage[i] || !cellsToAverage[i].data){

                    }else{
                        total = total + cellsToAverage[i].data.rand;
                        count++;
                    }
                }
                cellsToAverage[rowNum][colNum].data.smoothed = total / count;
            }
        }
        return cellsToAverage;
    }
    

});