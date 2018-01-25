/*jshint esversion: 6 */

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

app.listen(8080, function(){
	console.log('listening on *:8080');
});

// ------------------------
// Estrutura dados - server
// ------------------------

let games = new GameList();

io.on('connection', function (socket) {
    console.log('client has connected');

    socket.on('create_game', function (data){
    	console.log('A new game is about to be created');
    	let game = games.createGame(data.playerName, socket.id);
    	// Use socket channels/rooms
		socket.join(game.gameID);
		// Notification to the client that created the game
		socket.emit('my_active_games_changed');
		// Notification to all clients
		io.emit('lobby_changed');
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
		if(games.contadorID!=0){
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

	socket.on('remove_game',function(data){
		let game = games.removeGame(data.gameID,socket.id);
		socket.emit('my_active_games_changed');
	});

	socket.on('play',function(data){
		let game = games.gameByID(data.gameID);
		//tratar socket para gerir jogadas inválidas
		var numPlayer = game.playerSocketList.indexOf(socket.id);
		if(game.play(numPlayer, data.action)){
			io.to(game.gameID).emit('game_changed',game);
		}
		console.log('Play '+data.action);
	});

	socket.on('start_game',function(data){
		let game = games.gameByID(data.gameID);
		var numPlayer = game.playerSocketList.indexOf(socket.id);
		if(numPlayer == 0){
			game.gameStarted = true;
			io.to(game.gameID).emit('my_active_games_changed',game);
		}
		console.log('Game Started');
	});

});
