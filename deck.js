/*jshint esversion: 6 */

const Card = require('./card.js');

var axios = require('axios');

const apiBaseURL = "http://blackjack.dad/api/";
const headers = {headers: {
	"Accept": "application/json",
}};

class BlackJackDeck {
	constructor(callback) {
		this.id = this.randomDeckFromDB();
		let aux = this;
		this.attributeCards(function(cards) {

			console.log("SECONDDDDD");
			aux.cards = cards;
			callback(aux);
		}); 
	}

	attributeCards(callback) {
		let cardsAux = [];
		axios.get(apiBaseURL+'decks/'+this.id, headers)
		.then(response => {
			//console.log(response.data);
			cardsAux = response.data.cards;
			let cards = [];
			console.log(cardsAux);
			cardsAux.forEach(card => {
				let value = 0;
				switch(card.value) {
					case "Ace": 
					value = 11;
					break;
					case "Queen":
					case "Jack":
					case "King":
					value = 10;
					break;
					default :
					value = parseInt(card.value);
					break;
				}
				let name = card.path.substring((card.path.indexOf('/')+1), card.path.indexOf('.'));
				console.log(value+" / "+name);
				cards.push(new Card(name, value));
			});
			console.log(cards);
			console.log("FIRSTTTT");
			callback(cards);
		})
		.catch(error => {
			//console.log(error.response.data);
		});

	}

	randomDeckFromDB()
	{
		let max = 0;
		axios.get(apiBaseURL+'decks/quantity', headers)
		.then(response => {
			max = response.data.decks;
		})
		.catch(error => {
			console.log(error.response.data);
		});

		let number = Math.floor(Math.random()*(max-1+1)+1);

		return number;
	}
}

module.exports = BlackJackDeck;