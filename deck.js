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
		this.attributeCards(function(cards, name) {

			console.log("SECONDDDDD");
			aux.name = name;
			aux.cards = cards;
			callback(aux);
		}); 
	}

	attributeCards(callback) {
		
		let cardsAux = [];
		console.log(this.id)
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
			console.log("FIRSTTTT");
			callback(cards, response.data.name);
		})
		.catch(error => {
			//console.log(error.response.data);
		});

	}

	randomDeckFromDB()
	{
		let min = 0;
		let max = 0;
		axios.get(apiBaseURL+'decks/minMax', headers)
		.then(response => {
			min = response.data.min;
			max = response.data.max;
		})
		.catch(error => {
			console.log(error.response.data);
		});

		let number = Math.floor(Math.random()*(max-min+1)+min);

		return number;
	}
}
module.exports = BlackJackDeck;