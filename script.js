// MODULE THAT HANDLES THE GAME'S INTERNAL LOGIC ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Game = (function () {
    //DEFINE GAMEBOARD AND RENDER IT
    function gameboard() {
        let board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];

        const render = function () {
            for (let row of board) {
                console.log(row);
            }
        };

        //CHECK FOR WINNING CONDITIONS DEPENDING ON WHICH CELL IS SELECTED
        const hasWon = function (x, y) {
            const horizontal = board[y].every( (val, i, arr) => val === arr[0] );
            const diagonalLeft = [board[0][0], board[1][1],board[2][2]].every( (val, i, arr) => val === arr[0] && val !== " "); //ALWAYS CHECKS FOR DIAGONALS NO MATTER THE SELECTED CELL (WILL BE FIXED IN FUTURE ITERATIONS)
            const diagonalRight = [board[0][2], board[1][1],board[2][0]].every( (val, i, arr) => val === arr[0] && val !== " ");
            const vertical = [board[0][x], board[1][x],board[2][x]].every( (val, i, arr) => val === arr[0]);
            return (horizontal || diagonalLeft || diagonalRight || vertical);
        };

        const setCell = function (x, y, symbol) { //MODIFY BOARD WITHOUT ACCESSING DIRECTLY
            if (board[y][x] === " ") {
                board[y][x] = symbol;
                moveCounter++;
                if (hasWon(x, y)) {
                    Display.hasWon();
                    // console.clear();
                } else if (moveCounter > 8) {
                    Display.itsATie();
                }

                return true; // Successfully placed
            }
            return false; // Cell already occupied
        };

        return {board, render, setCell};
    }
    
    //SAVE PLAYER INFO
    function player(symbol) {
        return {symbol};
    }

    const player1 = player("X");
    const player2 = player("O");

    // CREATE NEW INSTANCE OF GAME(ASK FOR PLAYER INFO, RENDER GAMEBOARD, WAIT FOR PLAYER MOVE)
    let moveCounter;
    function newGame() {
        moveCounter = 0;
        let currentGame = gameboard();
        currentGame.render(Display.player1, Display.player2);

        const move = function(player, posX, posY) { //CHECK WHICH PLAYER, PLACE "PIECE"
            if ((posX < 3) && (posY < 3) && (posX > -1) && (posY > -1)) { //CHECK IF SELELECT CELL IS INSIDE THE BOARD
                const symbol = player === 1 ? player1.symbol : player2.symbol;
                if (currentGame.setCell(posX, posY, symbol)) {
                    currentGame.render(player1, player2);
                } else {
                    console.log("Invalid move! Cell already occupied.");
            }
            } else {
                console.log('Invalid move! Please select a cell inside the board!');
            }
        };

        return {currentGame, move}

    };
    
    return {newGame};
})();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// STORE PLAYER ICON SVGS IN "MORE USABLE" VARIABLES
const cross = '<svg xmlns="http://www.w3.org/2000/svg" fill="#000000" viewBox="280 -679 399 399"><path d="m336-280-56-56 144-144-144-143 56-56 144 144 143-144 56 56-144 143 144 144-56 56-143-144-144 144Z"/></svg>';
const circle = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,6.5A5.5,5.5 0 0,1 17.5,12A5.5,5.5 0 0,1 12,17.5A5.5,5.5 0 0,1 6.5,12A5.5,5.5 0 0,1 12,6.5Z"/></svg>';

// MODULE FOR DISPLAYING ALL INFO INTO THE UI ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const Display = (function() {
    
    // DEFINE EACH PLAYER'S INFORMATION AND BASIC FUNCTIONS, AND CACHE UI ELEMENTS FROM DOM
    const  player = function(pName, pNum, pSymbol, pScore, pInput, pForm, pButton) {
        const name = document.querySelector(pName);
        const num = pNum;
        const symbol = pSymbol;
        const score = document.querySelector(pScore);
        const input = document.querySelector(pInput);
        const form = document.querySelector(pForm);
        const button = document.querySelector(pButton)
        const resetName = document.querySelector(".reset-players")
        const resetScore = document.querySelector(".reset-game")

        const getPlayerName = function() {
            name.textContent = `${input.value}: `;
        }
        const showName = function() {
            name.style.display = "flex";
            form.style.display = "none";
        }
        const hideName = function() {
            name.style.display = "none";
            form.style.display = "flex";
        }

        button.addEventListener('click', event => {
            getPlayerName(name, input);
            showName(name, form);
        })
        resetName.addEventListener('click', event => {
            hideName();
        })
        resetScore.addEventListener('click', event => {
            score.textContent = "0";
            hideName();
            gameOne = Game.newGame();
            Display.gameRender(gameOne.currentGame.board);
            console.clear();
        })

        return {num, symbol, score, input};
        }

        
    
     // CREATE INSTANCES OF THE TWO PLAYERS
    const player1 = player("#player1 .name", 1, cross , "#p1-score", "#p1-input", "#player1 .player-input", "#p1-button"); 
    const player2 = player("#player2 .name", 2, circle, "#p2-score", "#p2-input", "#player2 .player-input", "#p2-button")
    let activePlayer = player1;

    // GRAB BOARD ARRAY FROM GAME MODULE, AND DISPLAY ITS CONTENTS IN THE UI GRID
    const gameRender = function (boardArray) {
        const gameboard = document.querySelector(".gameboard");
        gameboard.innerHTML = ""
        for (row in boardArray) {
            const posY = row
            for (arrcell in boardArray[row]) {
                let posX = arrcell
                const cell = document.createElement('div');
                cell.classList = 'gamecell';
                cell.innerHTML = boardArray[row][arrcell];
                gameboard.appendChild(cell);
                let playable = false;
                cell.addEventListener('mouseover', event => { //SHOW ACTIVE PLAYER'S ICON ON HOVER
                    if (cell.childElementCount < 1) {
                        playable = true;
                        cell.innerHTML = activePlayer.symbol; 
                        cell.addEventListener('mouseleave', event => { 
                            if (cell.childElementCount > 0 && playable) {
                                cell.innerHTML = ""; 
                                playable = false;
                            }
                        })  
                    }
                })
                cell.addEventListener('click', event => { //PLACE PLAYER "PIECE" WHEN CLICK ON GRID CELL
                    if (playable === true) {
                        gameOne.move(activePlayer.num, posX, posY);
                        activePlayer = activePlayer === player1 ? player2 : player1;
                        playable = false;
                    }
                })

                
            }
            
        }
        
    }

    // DISPLAY ROUND WINNER AND CLEAR BOARD
    const hasWon = function() {
        const winMessage = document.querySelector("#win-message h1");
        const disabler = document.querySelector(".disabler");
        const nextGame = document.querySelector(".next-game");
        const winner = activePlayer;
        disabler.style.display = "flex";
        winMessage.textContent = `${winner.input.value} WON THIS GAME!`
        let score = parseInt(winner.score.textContent) + 1;
        nextGame.addEventListener('click', event => {
            winner.score.textContent = score;
            disabler.style.display = "none"
            gameOne = Game.newGame()
            Display.gameRender(gameOne.currentGame.board);
            activePlayer = winner;
            console.clear()
        })

    };

    //SAME AS hasWon(), BUT IN CASE OF A TIE
    const itsATie = function() {
        const winMessage = document.querySelector("#win-message h1");
        const disabler = document.querySelector(".disabler");
        const nextGame = document.querySelector(".next-game");
        disabler.style.display = "flex";
        winMessage.textContent = `NOBODY WON THIS GAME`
        nextGame.addEventListener('click', event => {
            disabler.style.display = "none"
            gameOne = Game.newGame()
            Display.gameRender(gameOne.currentGame.board);
            console.clear()
        })
    };

    return {gameRender, hasWon, itsATie};
}) ();

let gameOne = Game.newGame(); //CREATE FIRST INSTANCE OF THE GAME (THIS IS REPEATED IN THE CODE EVERYTIME THE BAORD NEEEDS TO BE CLEARED AND A NEW GAME STARTED)
Display.gameRender(gameOne.currentGame.board); //DRAW THE BOARD ON THE GRID.