let gameBoard = document.getElementById("gameBoard");
let startButton = document.getElementById("startButton");
let scoreBoard = document.getElementById("scoreBoard");
//User Interface
const goldenRatio = (1 + Math.sqrt(5))/2;
let scoreBoardWidth = window.innerWidth / (goldenRatio + 1);
scoreBoard.style.position = "absolute";
scoreBoard.style.top = "40px";
scoreBoard.style.width = scoreBoardWidth + "px";
scoreBoard.style.minHeight = scoreBoardWidth / goldenRatio + "px";
scoreBoard.style.left = window.innerWidth - scoreBoardWidth - 80 + "px";

function renderScoreBoard() {
    let scoreBoardContent = "<h1>SCORE BOARD:</h1>"
    for (let i = 0; i < games.length; i++) {
        scoreBoardContent += "Game " + (i+1) + ": " + getPlayerSymbol(games[i].winner) + " won<br><br>"
        scoreBoard.innerHTML = scoreBoardContent;
    }
    requestAnimationFrame(renderScoreBoard);
}
requestAnimationFrame(renderScoreBoard);
//

startButton.addEventListener("click",startNewGame);

let games = [];
let currentGame;

function startNewGame() {
    let boardSize = parseInt(prompt("Board size?"));
    let numberToWin = parseInt(prompt("Number to Win?"));
    currentGame = new Game(boardSize, numberToWin);
    games.push(currentGame)
    currentGame.start();
}

function play(row,col) {
    let isCellAvailable = currentGame.checkAvailability(row,col);
    if ((!currentGame.isGameOver) && isCellAvailable) {
        let cell = new Cell(row,col,currentGame.currentPlayer);
        cell.updateGameState(currentGame);
        cell.draw();
        currentGame.checkWin();
        currentGame.currentPlayer = (currentGame.currentPlayer+1)%2;
    }
}

let Game = function Game(boardSize, numberToWin) {
    this.boardSize = boardSize;
    this.winner = null;
    this.currentPlayer = 0;
    this.isGameOver = false;
    this.numberToWin = numberToWin;
    this.gameState = [];
    this.start = function () {
        let boardContent = "";
        let cellSize = 40;
        for (let row = 0; row < this.boardSize; row++) {
            this.gameState[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                let leftPosition = (col+1) * cellSize;
                let topPosition  = (row+1) * cellSize;
                boardContent += "<div id='cell-" + row + "-" + col + "' " +
                    "onclick='play(" + row + "," + col + ")' " +
                    "style='position: absolute; width:" + cellSize + "px; height:" + cellSize + "px; " +
                    "top:" + topPosition + "px; left:" + leftPosition + "px'>" +
                    "</div>"
                this.gameState[row][col] = null;
            }
        }
        gameBoard.innerHTML = boardContent;
    }
    this.checkAvailability = function (row,col) {
        return this.gameState[row][col] === null;
    }
    this.checkWin = function() {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize - this.numberToWin + 1; j++) {
                let rowMatch = true;
                let colMatch = true;
                //check row
                if (this.gameState[i][j] === null) {
                    rowMatch = false;
                } else {
                    for (let check = 1; check < this.numberToWin; check++) {
                        if (this.gameState[i][j] !== this.gameState[i][j+check]) {
                            rowMatch = false;
                        }
                    }
                }
                //check col
                if (this.gameState[j][i] === null) {
                    colMatch = false;
                } else {
                    for (let check = 1; check < this.numberToWin; check++) {
                        if (this.gameState[j][i] !== this.gameState[j+check][i]) {
                            colMatch = false;
                        }
                    }
                }
                if (rowMatch || colMatch) {
                    this.endGame();
                    break;
                }
            }
        }
        for (let row = 0; row < this.boardSize - this.numberToWin + 1; row++) {
            for (let col = 0; col < this.boardSize - this.numberToWin + 1; col++) {
                let diagonal1Match = true;
                if (this.gameState[row][col] === null) {
                    diagonal1Match = false;
                } else {
                    for (let check = 1; check < this.numberToWin; check++) {
                        if (this.gameState[row][col] !== this.gameState[row+check][col+check]) {
                            diagonal1Match = false;
                        }
                    }
                }
                let diagonal2Match = true;
                let startRow = row + this.numberToWin - 1;
                if (this.gameState[startRow][col] === null) {
                    diagonal2Match = false;
                } else {
                    for (let check = 1; check < this.numberToWin; check++) {
                        if (this.gameState[startRow][col] !== this.gameState[startRow-check][col+check]) {
                            diagonal2Match = false;
                        }
                    }
                }
                if (diagonal1Match || diagonal2Match) {
                    this.endGame();
                    break;
                }
            }
        }
    }
    this.endGame = function () {
        this.winner = this.currentPlayer;
        alert("Player " + getPlayerSymbol(this.winner) + " has won!");
        this.isGameOver = true;
    }
}

let Cell = function Cell(row,col,value) {
    this.row = row;
    this.col = col;
    this.value = value;
    this.updateGameState = function (game) {
        game.gameState[this.row][this.col] = this.value;
    }
    this.draw = function () {
        let id = "cell-" + row + "-" + col;
        let cellElement = document.getElementById(id)
        cellElement.innerHTML = getPlayerSymbol(this.value);
    }
}

function getPlayerSymbol(player) {
    if (player === 0) {
        return "X"
    } else if (player === 1) {
        return "O"
    } else {
        return "No one"
    }
}