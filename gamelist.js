/*jshint esversion: 6 */

var BlackJackGame = require('./gamemodel.js');

class GameList {
	constructor() {
        this.contadorID = 0;
        this.games = new Map();
    }

    gameByID(gameID) {
    	let game = this.games.get(gameID);
    	return game;
    }

    createGame(playerName, socketID) {
    	this.contadorID = this.contadorID+1;
		var game = new BlackJackGame(this.contadorID, player1Name);
		game.playerSocketList.push(socketID);
    	this.games.set(game.gameID, game);
    	return game;
    }

    joinGame(gameID, playerName, socketID) {
    	let game = this.gameByID(gameID);
    	if (game===null) {
    		return null;
    	}
    	game.join(playerName);
    	game.playerSocketList.push(socketID);
    	return game;
    }

    removeGame(gameID, socketID) {
    	let game = this.gameByID(gameID);
    	if (game===null) {
    		return null;
		}
		var i = games.playerSocketList.indexOf(socketID);
		if(i != -1) {
			games.playerSocketList.splice(i, 1);
		}
    	if (games.playerSocketList.legth()<1) {
    		this.games.delete(gameID);
    	}
    	return game;
    }

    getConnectedGamesOf(socketID) {
    	let games = [];
    	for (var [key, value] of this.games) {
			value.playerSocketList.forEach(element => {
				if(element = socketID){
					games.push(value);
				}
			});			
		}
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