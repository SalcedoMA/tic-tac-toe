const Game = (function () {
    //DEFINE GAMEBOARD AND RENDER IT
    function gameboard() {
        let gameboard = [[" ", " ", " "], [" ", " ", " "], [" ", " ", " "]];
        const render = function (player1, player2) {
            // console.clear()
            console.log(player1, player2);
            for (row of gameboard) {
                console.log(row);
            }
        }
        return {gameboard, render};
    }
    
    //SAVE PLAYER INFO
    function player(name, symbol) {
        return {name, symbol};
    }

    // CREATE NEW INSTANCE OF GAME(ASK FOR PLAYER INFO, RENDER GAMEBOARD, WAIT FOR PLAYER MOVE)
    function newGame() {
        let player1 = player(prompt("Player 1?"), "X");
        let player2 = player(prompt("Player 2?"), "O");
        let currentGame = gameboard();
        currentGame.render(player1, player2)
        return function move(player, posX, posY) { //CHECK WHICH PLAYER, PLACE "PIECE"
            switch(player) {
                case 1:
                    currentGame.gameboard[posY-1][posX-1] = player1.symbol;
                    break;
                case 2:
                    currentGame.gameboard[posY-1][posX-1] = player2.symbol;
                    break;
            }
            currentGame.render(player1, player2);
        }

    }

    return {newGame};
})();


const gameOne = Game.newGame();
