'use strict'

var gLevel = {

}
var isGameOn = true
var safeCells = 0
var gBoard
const MINE = '💣'
const FLAG = '🚩'

document.addEventListener(`contextmenu`, (event) => {


    event.preventDefault();
});


function addFlagListeners() {
    var elFlagCell = document.querySelectorAll('td')
    for (var i = 0; i < elFlagCell.length; i++) {
        elFlagCell[i].addEventListener(`contextmenu`, (event) => {
            if (!isGameOn) return
            var elCell = event.target
            if (elCell.innerText === FLAG) return
            if (elCell.dataset.ismine) { elCell.classList.toggle('mine') }
            if (elCell.innerText !== FLAG) {
                elCell.innerText = FLAG
            } else if (elCell.dataset.ismine) {
                elCell.innerText = MINE
            } else {
                elCell.innerText = ''
            }
        });
    }
}

function onInIt() {
    gBoard = creatBoard(4)
    console.log(gBoard);
    randomMineLocation(gBoard, 2)
    renderBoard(gBoard)
    addFlagListeners()
}

function creatBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
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
                safeCells++
            } else {
                strHtml += `<td class="mine" data-ismine="${true}" data-i="${i}" data-j="${j}" onclick="onCellClick(this)">${MINE}</td>`
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

    if (!isGameOn) return
    if (elCell.innerText === FLAG) return
    if (elCell.innerText !== MINE) {
        var i = elCell.dataset.i
        var j = elCell.dataset.j
        elCell.innerText = setMinesNegsCount(i, j)
        if (elCell.innerText === '0') {
            expandShown(i, j)
        }
        safeCells--
    } else {
        var elMines = document.querySelectorAll('.mine')
        for (var i = 0; i < elMines.length; i++)
            elMines[i].classList.toggle('mine')
    }
    checkGameOver(elCell)
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

function checkGameOver(elCell) {
    if (safeCells === 0) {
        console.log('Victory');
        isGameOn = false

    } if (elCell.innerText === MINE) {
        console.log('you lose');
        isGameOn = false
    }
}

function selectBoardSize(elBtn) {


    if (elBtn.innerText === 'Medium') {
        gBoard = creatBoard(8)
        randomMineLocation(gBoard, 14)
        renderBoard(gBoard)
        addFlagListeners()
    }
    if (elBtn.innerText === 'Expert') {
        gBoard = creatBoard(12)
        randomMineLocation(gBoard, 32)
        renderBoard(gBoard)
        addFlagListeners()
    }
    if (elBtn.innerText === 'Beginner') {
        gBoard = creatBoard(4)
        randomMineLocation(gBoard, 2)
        renderBoard(gBoard)
        addFlagListeners()
    }
}

function expandShown(rowIdx, colIdx) {
    var elNeigCells = document.querySelectorAll('td')
    rowIdx = +rowIdx
    colIdx = +colIdx
    for (var x = rowIdx - 1; x <= rowIdx + 1; x++) {
        if (x < 0 || x >= gBoard.length) continue
        for (var y = colIdx - 1; y <= colIdx + 1; y++) {
            if (x === rowIdx && y === colIdx) continue
            if (y < 0 || y >= gBoard[0].length) continue
            for (var z = 0; z < elNeigCells.length; z++) {
                if (+elNeigCells[z].dataset.i === x &&
                    +elNeigCells[z].dataset.j === y) { onCellClick(elNeigCells[z]) }
            }
        }
    }
}