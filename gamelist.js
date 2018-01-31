/*jshint esversion: 6 */

var BlackJackGame = require('./gamemodel.js');
var axios = require('axios');

const apiBaseURL = "http://blackjack.dad/api/";
const headers = {headers: {
    "Accept": "application/json",
}};

class GameList {
    constructor() {
        this.games = new Map();
    }

    gameByID(gameID) {
        let game;

        this.games.forEach(gameF => {
            if( gameF.gameID = gameID ) {
                game = gameF;
            }
        });

        return game;
    }

    createGame(playerName, socketID, callback) {
        let aux = this;
        new BlackJackGame(playerName, function(gameAux) {

            var game = gameAux;
            game.playerSocketList = [];
            game.playerSocketList.push(socketID);
            game.playersThatWillPlay++;
            aux.games.set(game.gameID, game);

            var gameBD = {
                'total_players': game.playerList.length,
                'created_by': game.playerList[0].name,
                'deck_used': game.deck.id
            }

            axios.post(apiBaseURL+"game/create", gameBD, headers)
            .then(response => {
                game.gameID = response.data.game.id;
                callback(game);
            })
            .catch(error => {
                console.log(error.response.data);
            });

        });
    }

    joinGame(gameID, playerName, socketID) {
        let game = this.gameByID(gameID);
        if (game===null) {
            return null;
        }
        game.join(playerName);
        game.playerSocketList.push(socketID);
        game.playersThatWillPlay++;

        var gameBD = {
            'total_players': game.playerSocketList.length,
            'join': playerName
        }

        axios.put(apiBaseURL+"game/update/"+game.gameID, gameBD, headers)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error.response.data);
        });

        return game;
    }

    leaveGame(gameID, socketID) {
        let game = this.gameByID(gameID);
        let player;
        if (game===null) {
            return null;
        }
        var i = game.playerSocketList.indexOf(socketID);
        if(i != -1) {
            game.playerSocketList.splice(i, 1);
            player = game.playerList.splice(i, 1);
            game.playersThatWillPlay--;
        }
        if (game.playerSocketList.length<1) {
            this.games.delete(gameID);
            this.games.contadorID--;
        }
        if(game.playerList.length <= 1){
            game.gameCanBeStarted = 0;
        }

        var gameBD = {
            'total_players': game.playerList.length,
            'leave': player.name
        }

        axios.put(apiBaseURL+"game/update/"+game.gameID, gameBD, headers)
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error.response.data);
        });

        return game;
    }

    getConnectedGamesOf(nickname) {
        let games = [];
        this.games.forEach(game => {
            if(game.gameEnded == 0) {
                game.playerList.forEach(player => {
                    if(player.name == nickname){
                        games.push(game);
                    }
                });		
            }	
        });
        return games;
    }

    getLobbyGamesOf(socketID) {
        let games = [];
        for (var [key, value] of this.games) {
            if ((!value.gameStarted) && (!value.gameEnded))  {
                let check = false;
                value.playerSocketList.forEach(element => {
                    if(element == socketID){
                        check = true;
                    }
                });	
                if (!check) {
                    games.push(value);
                }
            }
        }
        return games;
    }
}

module.exports = GameList;
