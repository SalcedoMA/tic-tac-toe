const Game = (function () {
    //DEFINE GAMEBOARD AND RENDER IT
    function gameboard() {
        let board = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];

        const render = function (player1, player2) {
            console.log(player1, player2);
            for (let row of board) {
                console.log(row);
            }

        };

        const hasWon = function (x, y) {
            let fullRow = board[y - 1].every( (val, i, arr) => val === arr[0] );
            const winConditions = [
                [board[0][0], board[1][1],board[2][2]],
                [board[0][2], board[1][1],board[2][0]],
                [board[0][0], board[1][0],board[2][0]],
                [board[0][1], board[1][1],board[2][0]],
                [board[0][2], board[1][2],board[2][2]]
            ]

            if (fullRow) {
                return true;
            } else {
                for (condition of winConditions) {
                    if (condition.every( (val, i, arr) => val === arr[0] )) {
                        return true;
                    }
                }
            }
        };

        const setCell = function (x, y, symbol) { //FUNCTION TO MODIFY BOARD WITHOUT ACCESSING DIRECTLY
            if (board[y - 1][x - 1] === " ") {
                board[y - 1][x - 1] = symbol;
                if (hasWon(x, y)) {
                    console.clear();
                };

                return true; // Successfully placed
            }
            return false; // Cell already occupied
        };

        return { render, setCell };
    }
    
    //SAVE PLAYER INFO
    function player(name, symbol) {
        return {name, symbol};
    }

    // CREATE NEW INSTANCE OF GAME(ASK FOR PLAYER INFO, RENDER GAMEBOARD, WAIT FOR PLAYER MOVE)
    //CORRECTED CODE WITH IMPROVEMENTS
    function newGame() {
        // let player1 = player(prompt("Player 1 name?"), "X");
        // let player2 = player(prompt("Player 2 name?"), "O");
        let player1 = player("Manuel", "X");
        let player2 = player("Lenin", "O");
        let currentGame = gameboard();
        currentGame.render(player1, player2);

        return function move(player, posX, posY) { //CHECK WHICH PLAYER, PLACE "PIECE"
            const symbol = player === 1 ? player1.symbol : player2.symbol;
            if (currentGame.setCell(posX, posY, symbol)) {
                currentGame.render(player1, player2);
            } else {
                console.log("Invalid move! Cell already occupied.");
            }
        };
    }

    //OLD CODE, KEEPING FOR REFERENCE AND LEARNING
    // function newGame() {
    //     let player1 = player(prompt("Player 1 name?"), "X");
    //     let player2 = player(prompt("Player 2 name?"), "O");
    //     let currentGame = gameboard();
    //     currentGame.render(player1, player2)
    //     return function move(player, posX, posY) { //CHECK WHICH PLAYER, PLACE "PIECE"
    //         switch(player) {
    //             case 1:
    //                 currentGame.gameboard[posY-1][posX-1] = player1.symbol;
    //                 break;
    //             case 2:
    //                 currentGame.gameboard[posY-1][posX-1] = player2.symbol;
    //                 break;
    //         }
    //         currentGame.render(player1, player2);
    //     }

    // }

    return {newGame};
})();


const gameOne = Game.newGame();

// in order to make the first move I would write:
// gameOne(1, 1, 3) -> (player "1", x-coordinate "1", y-coordinate "3");
// gameOne(2, 3, 2) -> (player "2", x-coordinate "3", y-coordinate "2");
