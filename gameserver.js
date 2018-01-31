/*jshint esversion: 6 */
'use strict';

var app = require('http').createServer();

// CORS TRIALS
// var app = require('http').createServer(function(req,res){
// 	// Set CORS headers
// 	res.setHeader('Access-Control-Allow-Origin', 'http://dad.p6.dev');
// 	res.setHeader('Access-Control-Request-Method', '*');
// 	res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
// 	res.setHeader('Access-Control-Allow-Credentials', true);
// 	res.setHeader('Access-Control-Allow-Headers', req.header.origin);
// 	if ( req.method === 'OPTIONS' ) {
// 		res.writeHead(200);
// 		res.end();
// 		return;
// 	}
// });

var io = require('socket.io')(app);

var BlackJackGame = require('./gamemodel.js');
var GameList = require('./gamelist.js');

var axios = require('axios');
const apiBaseURL = "http://blackjack.dad/api/";
const headers = {headers: {
    "Accept": "application/json",
}};

app.listen(8080, function(){
	console.log('listening on *:8080');
});

function giveCardsToPlayers(){
	game.play(index, 1);
	io.to(game.gameID).emit('game_changed',game);
	socket.emit('my_hand_changed',{gameID: game.gameID, hand: game.showPlayerHand(numPlayer)});
}

// ------------------------
// Estrutura dados - server
// ------------------------

let games = new GameList();

io.on('connection', function (socket) {
	console.log('client has connected');

	socket.on('create_game', function (data){
		console.log('A new game is about to be created');
		games.createGame(data.playerName, socket.id, function(game) {

    		// Use socket channels/rooms
    		socket.join(game.gameID);
			// Notification to the client that created the game
			socket.emit('my_active_games_changed');
			// Notification to all clients
			io.emit('lobby_changed');
		});

	});

	socket.on('get_my_activegames',function(data){
		var my_games = games.getConnectedGamesOf(data.nickname);
		socket.emit('my_activegames', my_games);
	});

	socket.on('get_my_lobbygames',function(){
		var my_games = games.getLobbyGamesOf(socket.id);
		socket.emit('my_lobbygames', my_games);
	});

	socket.on('join_game', function(data){
		let alreadyInGame = 0;
		if(games.length!=0){
			let gameCheck = games.gameByID(data.gameID);
			gameCheck.playerList.forEach(player => {
				if(player.name == data.playerName){
					alreadyInGame = 1;
				}
			});
		}
		if(alreadyInGame==0){
			let game = games.joinGame(data.gameID, data.playerName, socket.id);
			socket.join(game.gameID);
			io.to(game.gameID).emit('my_active_games_changed');
		} else {
			let game = games.gameByID(data.gameID);
			io.to(game.gameID).emit('my_active_games_changed');
		}
		socket.emit('my_active_games_changed');
		io.emit('lobby_changed');
		
	});

	socket.on('leave_game',function(data){
		let game = games.leaveGame(data.gameID,socket.id);
		socket.emit('my_active_games_changed');
		io.emit('lobby_changed');
		io.to(data.gameID).emit('game_changed', game);
	});

	socket.on('remove_game',function(data){
		socket.emit('my_active_games_changed');
	});

	socket.on('play',function(data){
		let game = games.gameByID(data.gameID);
		//tratar socket para gerir jogadas inválidas
		var numPlayer = game.playerSocketList.indexOf(socket.id);
		
		if(data.action == 0){
			game.playerList[numPlayer].stand = 1;
			game.playersThatWillPlay--;
		} else {
			if(!game.playersThatPlayed.includes(numPlayer)){
				game.playersThatPlayed.push(numPlayer);
			}
		}
		game.checkGameEnded();
		console.log("Game state "+game.gameEnded);
		console.log("Players that played "+game.playersThatWillPlay);
		if(game.playersThatPlayed.length == game.playersThatWillPlay){
			if(game.gameEnded==0){
				game.playerList.forEach((player,index) => {
					if(game.play(index)){
						io.to(game.gameID).emit('game_changed',game);
						io.to(game.playerSocketList[index]).emit('my_hand_changed',{gameID: game.gameID, hand: game.showPlayerHand(index)});
					}
				});
				if(game.checkGameEnded()) {
					game.winners = game.checkWinners();
					io.to(game.gameID).emit('game_changed',game);
				}
				game.turn += 1;
				game.playersThatPlayed = [];
			} else {
				game.winners = game.checkWinners();
				io.to(game.gameID).emit('game_changed',game);
			}
		}
		console.log('Player chose '+ data.action);
	});

	socket.on('start_game',function(data){
		let game = games.gameByID(data.gameID);
		var numPlayer = game.playerSocketList.indexOf(socket.id);
		

		if(numPlayer == 0 && game.gameCanBeStarted){
			game.gameStarted = true;
			game.shuffleDeck(game.deck.cards);
			io.to(game.gameID).emit('my_active_games_changed',game);
			console.log('Game Started');
		}
		for(let i=0;i<2;i++){
			game.playerList.forEach((player,index) => {
				if(game.play(index)){
					io.to(game.gameID).emit('game_changed',game);
					io.to(game.playerSocketList[index]).emit('my_hand_changed',{gameID: game.gameID, hand: game.showPlayerHand(index)});
				}
			});
			game.turn += 1;
		}

		var gameBD = {
            'status': 'active',
        }

		axios.put(apiBaseURL+"game/update/"+game.gameID, gameBD, headers)
		.then(response => {
			console.log(response.data);
		})
		.catch(error => {
			console.log(error.response.data);
		});
	});

});
