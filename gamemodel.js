/*jshint esversion: 6 */
'use strict';

var axios = require('axios');
//const apiBaseURL = "http://blackjackdad.ga/api/";
const apiBaseURL = "http://blackjack.dad/api/";
const headers = {headers: {
    "Accept": "application/json",
}};

const Player = require('./player.js');
const Card = require('./card.js');
const Deck = require('./deck.js');


//const eArr = [new Card("e1",11),new Card("e2",2), new Card("e3",3),new Card("e4",4),new Card("e5",5),new Card("e6",6),new Card("e7",7),new Card("e8",8),new Card("e9",9),new Card("e10",10),new Card("e11",10),new Card("e12",10),new Card("e13",10)];
//const pArr = [new Card("p1",11),new Card("p2",2), new Card("p3",3),new Card("p4",4),new Card("p5",5),new Card("p6",6),new Card("p7",7),new Card("p8",8),new Card("p9",9),new Card("p10",10),new Card("p11",10),new Card("p12",10),new Card("p13",10)];
//const cArr = [new Card("c1",11),new Card("c2",2), new Card("c3",3),new Card("c4",4),new Card("c5",5),new Card("c6",6),new Card("c7",7),new Card("c8",8),new Card("c9",9),new Card("c10",10),new Card("c11",10),new Card("c12",10),new Card("c13",10)];
//const oArr = [new Card("o1",11),new Card("o2",2), new Card("o3",3),new Card("o4",4),new Card("o5",5),new Card("o6",6),new Card("o7",7),new Card("o8",8),new Card("o9",9),new Card("o10",10),new Card("o11",10),new Card("o12",10),new Card("o13",10)];

const Hit = 1;
const Stand = 0;

class BlackJackGame {
    constructor(player1Name, callback) {
        this.gameID = 0;
        this.gameEnded = false;
        this.gameCanBeStarted = false;
        this.gameStarted = false;
        this.playerList = [new Player(player1Name)];

        this.playersThatPlayed = [];
        this.playersThatWillPlay = 0;
        this.turn = 0;
        this.winners = [];
        this.points = 50;
        let aux = this;
        new Deck(function(deckAux) {
            aux.deck = deckAux;
            console.log("THIRDDDD");
            callback(aux);
        });
    }

    join(playerName){
        this.playerList.push(new Player(playerName));
        this.gameCanBeStarted = true;
    }

    showPlayerHand(playerNumber){
        let hand = this.playerList[playerNumber].showHand();
        return hand;
    }

    checkGameEnded(){
        let notYet = 0;
        this.playerList.forEach(player => {
            if(player.stand == 0){
                notYet = 1;
            }
        });
        if(notYet==1){
            return false;
        } else {
            this.playerList.forEach(player => {
                player.pubHand = player.showHand();
            });
            this.gameEnded = true;

            return true;
        }
    }

    checkWinners(){
        let winners = [];
        let winnersBD = [];
        let players = [];
        let winnerHandSum = 0;
        let playerHandSum = 0;
        let numWinners = 0;
        if(this.checkGameEnded()){
            this.playerList.forEach(player => {
                playerHandSum = player.handSum();
                if(playerHandSum <= 21 && playerHandSum > winnerHandSum){
                    winnerHandSum = playerHandSum;
                }
            });
            if (winnerHandSum == 21){
                this.points += 50;
            }
            this.playerList.forEach(player => {
                playerHandSum = player.handSum();
                if(playerHandSum == winnerHandSum){
                    numWinners++;
                    winnersBD.push(player.name);
                    winners.push(player);
                }
                players.push(player.name);
            });
            if (numWinners == 1){
                this.points += 50;
            }
            var gameBD = {
                'status': 'terminated',
                'winners': winnersBD,
                'players': players,
                'points': this.points
            }

            axios.put(apiBaseURL+"game/update/"+this.gameID, gameBD, headers)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.response.data);
            });
        }

        return winners;
    }

    shuffleDeck(deck) {
        var j, x, i;
        for (i = deck.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = deck[i];
            deck[i] = deck[j];
            deck[j] = x;
        }
    }

    play(playerIndex){
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
        if (player.pubHand.length == 4) {
            player.stand = 1;
            return false;
        }
        if(player.stand == 0){
            let lastCardArr = this.deck.cards.splice((this.deck.cards.length-1),1);
            player.addCard(lastCardArr[0]);
            if(player.handSum() >= 21) {
                player.stand = 1;
                this.playersThatWillPlay--;
            }
            return true;
        }
        return false;
    }
}

module.exports = BlackJackGame;
