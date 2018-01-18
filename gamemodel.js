/*jshint esversion: 6 */

const Player = require('./player.js');

class BlackJackGame {
    constructor(ID, player1Name) {
        this.gameID = ID;
        this.gameEnded = false;
        this.gameCanBeStarted = false;
        this.gameStarted = false;
        this.playerList = [new Player(player1Name)];
        this.winner = 0;
    }

    join(playerName){
        this.playerList.push(new Player(playerName));
        this.gameCanBeStarted = true;
    }

    checkWinners(){
        let winners = [];
        let winnerHandSum = 0;
        let playerHandSum = 0;
        playerList.forEach(player => {
            playerHandSum = player.sum();
            if(playerHandSum <= 21 && playerHandSum > winnerHandSum){
                winnerHandSum = playerHandSum;
            }
        });
        playerList.forEach(player => {
            playerHandSum = player.sum();
            if(playerHandSum = winnerHandSum){
                winners.push(player);
            }
        });
    }

    
//------------------TODO--DOWN------------------------
    isBoardComplete(){
        for (let value of this.board) {
            if (value === 0) {
                return false;
            }
        }
        return true;
    }

    play(playerNumber, index){
        if (!this.gameStarted) {
            return false;
        }
        if (this.gameEnded) {
            return false;
        }
        if (playerNumber != this.playerTurn) {
            return false;
        }
        if (this.board[index] !== 0) {
            return false;
        }
        this.board[index] = playerNumber;
        if (!this.checkGameEnded()) {
            this.playerTurn = this.playerTurn == 1 ? 2 : 1;
        }
        return true;
    }

}

module.exports = BlackJackGame;
