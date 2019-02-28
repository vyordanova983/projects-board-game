
var arrMovedWhitePawnList = [];
var arrMovedBlackPawnList = [];

var arrMovedBlackCastleList = [];
var arrMovedWhiteCastleList = [];

var selectedPiece = null;
var previousMovedPiece = null;

/**-------------------Receives click events-------------**/
$(document).on("click", function (event) {
    var x = event.pageX;
    var y = event.pageY;
    var clickedElement = document.elementFromPoint(x, y);
    var id = $(clickedElement).attr('id');

    if (id !== undefined && id.includes("cell")) {//if clicked an empty cell
        if (selectedPiece !== null && selectedPiece.id !== id) { //if one piece selected & then select other cell
            refreshCells(selectedPiece);
        }
        move(selectedPiece, clickedElement); //if previously selected a piece and now select a cell then selected piece move to selected cell

    } else if (id !== undefined && id.includes("p")) { //if clicked a piece

        if (selectedPiece !== null && selectedPiece.id !== id) { //if one piece selected & then select other piece
            refreshCells(selectedPiece);
        }
        calculatePos(id);
        killOppositePiece(selectedPiece, clickedElement);

    }
});

function calculatePos(pieceId) {
    var cellID = $("#" + pieceId).parent('div').attr('id');

    if (previousMovedPiece !== null && pieceId.includes(previousMovedPiece.type)) {
        return;
    }

    if (pieceId.includes("dwarf")) {
        if (pieceId.includes("black")) {
            var pawn = createNewBlackDwarf(pieceId, cellID);
            calculatePathAhead(pawn);

        } else if (pieceId.includes("white")) {
            var pawn = createNewWhiteDwarf(pieceId, cellID);
            calculatePathAhead(pawn);
        }

    } else if (pieceId.includes("elf")) {
        if (pieceId.includes("black")) {
            var castle = createNewBlackElf(pieceId, cellID);
            calculatePathTop(castle);

        } else if (pieceId.includes("white")) {
            var castle = createNewWhiteElf(pieceId, cellID);
            calculatePathTop(castle);
        }

    }
}



/**
 *
 Elf Factory
 */

function createNewWhiteElf(pieceId, cellID) {
    for (var i = 0; i < arrMovedWhiteCastleList.length; i++) {
        var castle = arrMovedWhiteCastleList[i];

        if (castle.id === pieceId) {
            return castle;
        }
    }

    castle = new Piece(pieceId, "white", cellID);
    arrMovedWhiteCastleList.push(castle);
    return castle;
}

function createNewBlackElf(pieceId, cellID) {
    for (var i = 0; i < arrMovedBlackCastleList.length; i++) {
        var castle = arrMovedBlackCastleList[i];

        if (castle.id === pieceId) {
            return castle;
        }
    }

    castle = new Piece(pieceId, "black", cellID);
    arrMovedBlackCastleList.push(castle);
    return castle;
}

/**
 *
 Pawn Factory
 */

function createNewBlackDwarf(pieceId, cellID) {

    for (var i = 0; i < arrMovedBlackPawnList.length; i++) {
        var pawn = arrMovedBlackPawnList[i];
        if (pawn.id === pieceId) {
            return pawn;
        }
    }
    pawn = new Piece(pieceId, "black", cellID);
    arrMovedBlackPawnList.push(pawn);
    return pawn;
}

function createNewWhiteDwarf(pieceId, cellID) {
    for (var i = 0; i < arrMovedWhitePawnList.length; i++) {
        var pawn = arrMovedWhitePawnList[i];
        if (pawn.id === pieceId) {
            return pawn;
        }
    }
    pawn = new Piece(pieceId, "white", cellID);
    arrMovedWhitePawnList.push(pawn);
    return pawn;
}

/**
 *
 Knight Factory
 */

/**-----------------------Piece Object-----------------------**/
function Piece(id, type, currentPosition) {
    this.id = id;
    this.type = type;
    this.currentPosition = currentPosition;

    this.isFirstMove = true;
    this.positionsToBeMoved = [];
    this.obstaclesCanBeKilled = [];
}

//Pawn
function calculatePathAhead(obj) {
    selectedPiece = obj;
    //colorPawnKillCell(obj);
    if (obj.type === "white") {
        var offset = $("#" + obj.currentPosition).offset();
        var x = offset.left;
        var y = offset.top - 65;

        var nextCell = document.elementFromPoint(x, y);
        var downCell = document.elementFromPoint(offset.left, offset.top + 65);
        var leftCell = document.elementFromPoint(offset.left - 65, offset.top);
        var rightCell = document.elementFromPoint(offset.left + 65, offset.top);

        colorCells(obj, nextCell);
        colorCells(obj, downCell);
        colorCells(obj, leftCell);
        colorCells(obj, rightCell);
        /*if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            if (obj.isFirstMove) {
                y -= 65;
                nextCell = document.elementFromPoint(x, y);
                if (!isObstaclesFound(obj, nextCell)) {
                    //colorCells(obj, nextCell);
                }
            }
        }*/

    } else if (obj.type === "black") {
        var offset = $("#" + obj.currentPosition).offset();
        var x = offset.left;
        var y = offset.top + 65;

        var nextCell = document.elementFromPoint(x, y);
        var downCell = document.elementFromPoint(offset.left, offset.top + 65);
        var leftCell = document.elementFromPoint(offset.left - 65, offset.top);
        var rightCell = document.elementFromPoint(offset.left + 65, offset.top);
        var bottomCell = document.elementFromPoint(x, y - 130);

        colorCells(obj, nextCell);
        colorCells(obj, downCell);
        colorCells(obj, leftCell);
        colorCells(obj, bottomCell);
        colorCells(obj, rightCell);

        if (!isObstaclesFound(obj, nextCell)) {
            colorCells(obj, nextCell);
            if (obj.isFirstMove) {
                y += 65;
                nextCell = document.elementFromPoint(x, y);
                if (!isObstaclesFound(obj, nextCell)) {
                    colorCells(obj, nextCell);
                }
            }
        }
    }
}

//for castle queen and king
function calculatePathTop(obj) {

    selectedPiece = obj;
    var offset = $("#" + obj.currentPosition).offset();
    var x = offset.left;
    var y = offset.top - 65;
    var cells = [];

    var nextCell = document.elementFromPoint(x + 130, y+130);

    var firstCellForward = document.elementFromPoint(offset.left, offset.top - 65);
    var secondCellForward = document.elementFromPoint(offset.left, offset.top - 130);
    var thirdCellForward = document.elementFromPoint(offset.left, offset.top - 195);

    var firstCellLeft = document.elementFromPoint(x - 65, y);

    var secondCellLeft = document.elementFromPoint(x - 130, y);
    var firstCellRight = document.elementFromPoint(x + 65, y);
    var secondCellRight = document.elementFromPoint(x + 130, y);

    var firstLeft = document.elementFromPoint(x-65, y+65);
    var secondLeft = document.elementFromPoint(x-130, y+65);
    var thirdLeft = document.elementFromPoint(x-195, y+65);

    var firstRight = document.elementFromPoint(x+65, y+65);
    var secondRight = document.elementFromPoint(x+130, y+65);
    var thirdRight = document.elementFromPoint(x+195, y+65);

    var bottom = document.elementFromPoint(x, y+130);
    var firstBottomLeft = document.elementFromPoint(x - 65, y+130);
    var secondBottomLeft = document.elementFromPoint(x - 130, y+130);
    var firstBottomRight = document.elementFromPoint(x + 65, y+130);
    var secondBottomRight = document.elementFromPoint(x + 130, y+130);

    Array.prototype.push.apply(cells, [nextCell, firstCellForward, secondCellForward,thirdCellForward, firstCellLeft, secondCellLeft, firstCellRight,
        secondCellRight, firstLeft, secondLeft, thirdLeft, firstRight, secondRight, thirdRight, bottom, firstBottomLeft, secondBottomLeft,
        firstBottomRight, secondBottomRight
    ]);

    for(var i = 0; i < cells.length; i++) {
        var current = cells[i];

            colorCells(obj, current);

    }

}


function move(obj, cell) {


    for (var i = 0; i < obj.positionsToBeMoved.length; i++) {
        if (obj.positionsToBeMoved[i] === cell) {
            $("#" + obj.id).appendTo(cell);
            refreshCells(obj);
            obj.currentPosition = $(cell).attr('id');
            previousMovedPiece = obj;
            obj.isFirstMove = false;
        }
    }
    isKingChecked(obj.type === "white" ? "black" : "white");
    obj.positionsToBeMoved = [];
}

function killOppositePiece(obj, clickedPiece) {
    //clickedPiece is opposite side piece can be killed
    //obstaclesCanBeKilled has pieces of opposite side that can be killed by bishop
    var cell = $(clickedPiece).parent('div');
    for (var i = 0; i < obj.obstaclesCanBeKilled.length; i++) {
        if ($(clickedPiece).attr('id') === obj.obstaclesCanBeKilled[i].attr('id')) {
            $(clickedPiece).remove();
            $("#" + obj.id).appendTo(cell);
            refreshCells(obj);
            obj.currentPosition = $(cell).attr('id');
            previousMovedPiece = obj;
        }
    }
}

function colorCells(obj, elem) {
    obj.positionsToBeMoved.push(elem);
    $(elem).addClass("color-path");
    $("html").removeClass("color-path");
}

function colorKillCell(cell) {
    $(cell).addClass("color-path");
}


function refreshCells(obj) {
    for (var i = 0; i < obj.positionsToBeMoved.length; i++) {
        $(obj.positionsToBeMoved[i]).removeClass("color-path");
    }

    for (var i = 0; i < obj.obstaclesCanBeKilled.length; i++) {
        $(obj.obstaclesCanBeKilled[i]).parents('div').removeClass("color-path");
    }
}

function isObstaclesFound(obj, nextCell) {
    var child = $(nextCell).children('span');
    if (obj.id.includes("pawn")) { //if the object is a pawn
        if (child.attr('id') === undefined) {
            return false;
        }
        return true;
    }
    //rest of other objects
    if (child.attr('id') === undefined) {
        var id = $(nextCell).attr('id');
        if (id !== undefined && id.includes("cell")) {
            return false;
        }
    } else {
        if (!child.attr('id').includes(obj.type)) {
            obj.obstaclesCanBeKilled.push(child);
            colorKillCell(nextCell);
        }
    }
    return true;
}

