'use strict'

var gBoard
const MINE = '💣'

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
                strHtml += `<td data-i="${i}" data-j="${j}" onclick="onCellClick(this,${i},${j})"></td>`
            } else {
                strHtml += `<td onclick="onCellClick(this)">${MINE}</td>`
            }

        }
        strHtml += `</tr >`
    }
    elTable.innerHTML = strHtml
}
function setMinesNegsCount(rowIdx, colIdx) {
    var count = 0
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[0].length) continue
            if (gBoard[i][j] === MINE) count++
        }
    }
    return count
}

function onCellClick(elcell) {

    if (elcell.innerText !== MINE) {
        var i = elcell.dataset.i
        var j = elcell.dataset.j
        elcell.innerText = setMinesNegsCount(i, j)
    }
}


function randomMineLocation(gBoard, numOfBombs) {
    var minecounter = 0
    while (minecounter < numOfBombs) {
        var randRowIdx = getRandomInt(0, gBoard.length)
        var randColIdx = getRandomInt(0, gBoard.length)
        if (gBoard[randRowIdx][randColIdx] !== MINE) {
            gBoard[randRowIdx][randColIdx] = MINE
            minecounter++
        }
    }
}