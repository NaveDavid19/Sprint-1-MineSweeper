'use strict'

const MINE = '💣'
const FLAG = '🚩'

const difficulties = {
    beginner: {
        size: 4,
        numOfMines: 2
    },
    medium: {
        size: 8,
        numOfMines: 14
    },
    expert: {
        size: 12,
        numOfMines: 32
    }
}

var isGameOn
var safeCells = 0
var gBoard
var currDifficulty
var mineCounter
var isFirstClick
var elBtnReset = document.querySelector('.smiley')
var elLives = document.querySelector('p')

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
            checkGameOver()
        });
    }
}

function onInIt() {
    isGameOn = true
    isFirstClick = true
    mineCounter = 0
    elLives.innerText = '♥ ♥ ♥'
    currDifficulty = difficulties.beginner

    gBoard = creatBoard(currDifficulty.size)
    renderBoard(gBoard)
    addFlagListeners()
}

function creatBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []

        for (var j = 0; j < size; j++) {
            board[i][j] = ''
        }
    }
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
    var i = elCell.dataset.i
    var j = elCell.dataset.j

    if (isFirstClick) {
        randomMineLocation(currDifficulty.numOfMines, i, j)
        renderBoard(gBoard)
        var elCells = document.querySelectorAll('td')
        for (var z = 0; z < elCells.length; z++) {
            if (elCells[z].dataset.i === i && elCells[z].dataset.j === j) {
                elCell = elCells[z]
            }
        }
        addFlagListeners()
        isFirstClick = false
    }
    if (!isGameOn) return
    if (elCell.innerText === FLAG) return
    if (elCell.innerText !== MINE) {
        elCell.classList.add('disabled')
        elCell.innerText = setMinesNegsCount(i, j)
        if (elCell.innerText === '0') {
            expandShown(i, j)
        }
        safeCells--
    }
    if (elCell.innerText === MINE) {
        mineCounter++
        elCell.classList.remove('mine')
        elCell.classList.add('disabled')
    }
    if (mineCounter === 1) {
        elLives.innerText = '♥ ♥'
    }
    if (mineCounter === 2) {
        elLives.innerText = '♥'
    }
    if (mineCounter === 3) {
        elLives.innerText = ''
        var elMines = document.querySelectorAll('.mine')
        for (var i = 0; i < elMines.length; i++)
            elMines[i].classList.toggle('mine')
    }
    checkGameOver()
}

function randomMineLocation(numOfMines, skipRowIdx, skipColIdx) {
    var counter = 0
    while (counter < numOfMines) {
        var randRowIdx = getRandomInt(0, gBoard.length)
        var randColIdx = getRandomInt(0, gBoard.length)
        if (randRowIdx === +skipRowIdx && randColIdx === +skipColIdx) {
            continue;
        }

        var currCell = gBoard[randRowIdx][randColIdx]
        if (currCell !== MINE) {
            gBoard[randRowIdx][randColIdx] = MINE
            counter++
        }
    }

    safeCells = currDifficulty.size ** 2 - counter
}

function checkGameOver() {
    // console.log('hey');
    var isFlagged = isMinesFlagged()
    if (safeCells === 0 & isFlagged) {
        elBtnReset.innerText = '😎'
        console.log('Victory');
        isGameOn = false
    }

    if (mineCounter === 3) {
        elBtnReset.innerText = '🤯'
        console.log('you lose');
        isGameOn = false
    }
}

function selectBoardSize(elBtn) {
    if (elBtn.innerText === 'Beginner') {
        currDifficulty = difficulties.beginner
    }

    if (elBtn.innerText === 'Medium') {
        currDifficulty = difficulties.medium
    }

    if (elBtn.innerText === 'Expert') {
        currDifficulty = difficulties.expert
    }

    gBoard = creatBoard(currDifficulty.size)
    renderBoard(gBoard)
    addFlagListeners()
}

function expandShown(rowIdx, colIdx) {
    var elNeigCells = document.querySelectorAll('.empty')
    rowIdx = +rowIdx
    colIdx = +colIdx
    for (var x = rowIdx - 1; x <= rowIdx + 1; x++) {
        if (x < 0 || x >= gBoard.length) continue
        for (var y = colIdx - 1; y <= colIdx + 1; y++) {
            if (x === rowIdx && y === colIdx) continue
            if (y < 0 || y >= gBoard[0].length) continue

            for (var z = 0; z < elNeigCells.length; z++) {
                var neighbor = elNeigCells[z]
                if (+neighbor.dataset.i === x &&
                    +neighbor.dataset.j === y) {
                    if (neighbor.innerText === '') {
                        onCellClick(elNeigCells[z])
                    }
                }
            }
        }
    }
}



function isMinesFlagged() {
    var isFlagged
    var elCells = document.querySelectorAll('td')
    for (var i = 0; i < elCells.length; i++) {
        var currCell = elCells[i]
        if (currCell.dataset.ismine) {
            if (currCell.innerText === FLAG) {
                isFlagged = true
            } else {
                isFlagged = false
                break;
            }
        }
    }
    return isFlagged
}