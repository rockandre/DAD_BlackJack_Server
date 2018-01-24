/*jshint esversion: 6 */

const Player = require('./player.js');
const Card = require('./card.js');

const eArr = [new Card("e1",11),new Card("e2",2), new Card("e3",3),new Card("e4",4),new Card("e5",5),new Card("e6",6),new Card("e7",7),new Card("e8",8),new Card("e9",9),new Card("e10",10),new Card("e11",10),new Card("e12",10),new Card("e13",10)];
const pArr = [new Card("p1",11),new Card("p2",2), new Card("p3",3),new Card("p4",4),new Card("p5",5),new Card("p6",6),new Card("p7",7),new Card("p8",8),new Card("p9",9),new Card("p10",10),new Card("p11",10),new Card("p12",10),new Card("p13",10)];
const cArr = [new Card("c1",11),new Card("c2",2), new Card("c3",3),new Card("c4",4),new Card("c5",5),new Card("c6",6),new Card("c7",7),new Card("c8",8),new Card("c9",9),new Card("c10",10),new Card("c11",10),new Card("c12",10),new Card("c13",10)];
const oArr = [new Card("o1",11),new Card("o2",2), new Card("o3",3),new Card("o4",4),new Card("o5",5),new Card("o6",6),new Card("o7",7),new Card("o8",8),new Card("o9",9),new Card("o10",10),new Card("o11",10),new Card("o12",10),new Card("o13",10)];

const Hit = 1;
const Stand = 0;

class BlackJackGame {
    constructor(ID, player1Name) {
        this.gameID = ID;
        this.gameEnded = false;
        this.gameCanBeStarted = false;
        this.gameStarted = false;
        this.playerList = [new Player(player1Name)];
        this.deck = [...eArr,...pArr,...cArr,...oArr];
    }

    join(playerName){
        this.playerList.push(new Player(playerName));
        this.gameCanBeStarted = true;
    }

    checkGameEnded(){
        playerList.forEach(player => {
            if(player.stand == 0){
                return false;
            }
        });
        this.gameEnded = true;
        return true;
    }

    checkWinners(){
        let winners = [];
        let winnerHandSum = 0;
        let playerHandSum = 0;
        if(checkGameEnded()){
            playerList.forEach(player => {
                playerHandSum = player.sum();
                if(playerHandSum <= 21 && playerHandSum > winnerHandSum){
                    winnerHandSum = playerHandSum;
                }
            });
            playerList.forEach(player => {
                playerHandSum = player.sum();
                if(playerHandSum == winnerHandSum){
                    winners.push(player);
                }
            });
        }
        return winners;
    }

    shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
    }

    play(playerIndex, action){
        if(playerIndex == -1){
            return false;
        }
        let player = this.playerList[playerIndex];
        if (!this.gameStarted) {
            return false;
        }
        if (this.gameEnded) {
            return false;
        }
        if (player.hand.length = 4) {
            player.stand = 1;
            return false;
        }
        if(action == Hit){
            player.addCard(this.deck.splice((deck.length-1),1));
        }
        if(action == Stand){
            player.stand = 1;
        }
        return true;
    }
}

module.exports = BlackJackGame;
