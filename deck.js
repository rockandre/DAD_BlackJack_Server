/*jshint esversion: 6 */
'use strict';

const Card = require('./card.js');

var axios = require('axios');

const apiBaseURL = "http://188.166.152.94/api/";
const headers = {headers: {
	"Accept": "application/json",
}};

class BlackJackDeck {
	constructor(callback) {
		let aux = this;
		this.randomDeckFromDB(function(id) {
			aux.id = id;

			aux.attributeCards(function(cards, name) {

				console.log("SECONDDDDD");
				aux.name = name;
				aux.cards = cards; 

				callback(aux);
			}); 

		});
		
	}

	attributeCards(callback) {
		
		let cardsAux = [];
		axios.get(apiBaseURL+'decks/'+this.id, headers)
		.then(response => {
			cardsAux = response.data.cards;
			let cards = [];
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
				cards.push(new Card(name, value));
			});
			callback(cards, response.data.name);
		})
		.catch(error => {
			console.log(error.response.data);
		});

	}

	randomDeckFromDB(callback)
	{
		let min = 0;
		let max = 0;
		axios.get(apiBaseURL+'decks/minMax', headers)
		.then(response => {
			min = response.data.min;
			max = response.data.max;

			let number = Math.floor(Math.random()*(max-min+1)+min);

			callback(number);
		})
		.catch(error => {
			console.log(error.response.data);
		});
	}
}
module.exports = BlackJackDeck;
