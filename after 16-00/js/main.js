'use strict'

var gBoard
const MINE = '💣'
const FLAG = '🚩'



document.addEventListener(`contextmenu`, (event) => {
    event.preventDefault();
});




function onInIt() {
    gBoard = creatBoard(4, 4)
    console.log(gBoard);
    randomMineLocation(gBoard, 2)
    renderBoard(gBoard)
}

function creatBoard(rowIdx, colIdx) {
    var board = []
    for (var i = 0; i < rowIdx; i++) {
        board[i] = []

        for (var j = 0; j < colIdx; j++) {
            board[i][j] = {}
        }
    }
    // board[2][2] = MINE
    // board[3][1] = MINE
    return board
}

function renderBoard(board) {
    var elTable = document.querySelector('table')
    var strHtml = ''
    for (var i = 0; i < board.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < board.length; j++) {
            if (board[i][j] !== MINE) {
                strHtml += `<td class="empty" data-i="${i}" data-j="${j}" onclick="onCellClick(this)"></td>`
            } else {
                strHtml += `<td class="hide" onclick="onCellClick(this)">${MINE}</td>`
            }

        }
        strHtml += `</tr >`
    }
    elTable.innerHTML = strHtml
}
function setMinesNegsCount(rowIdx, colIdx) {
    var count = 0

    rowIdx = +rowIdx
    colIdx = +colIdx
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            var currCell = gBoard[i][j]
            if (currCell === MINE) count++
        }
    }
    return count
}


function onCellClick(elCell) {
    if (elCell.innerText !== MINE) {
        var i = elCell.dataset.i
        var j = elCell.dataset.j
        elCell.innerText = setMinesNegsCount(i, j)
    }
    else {
        elCell.classList.toggle('hide')
    }
}


function randomMineLocation(gBoard, numOfBombs) {
    var minecounter = 0
    while (minecounter < numOfBombs) {
        var randRowIdx = getRandomInt(0, gBoard.length)
        var randColIdx = getRandomInt(0, gBoard.length)
        var currCell = gBoard[randRowIdx][randColIdx]
        if (currCell !== MINE) {
            gBoard[randRowIdx][randColIdx] = MINE
            minecounter++
        }
    }
}


