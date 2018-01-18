/*jshint esversion: 6 */

const Card = require('./card.js');

class BlackJackPlayer {
    constructor(Name) {
        this.name = Name;
        this.hand = [];
        this.stand = 0;
    }

    handSum(){
        sum = 0;
        this.hand.forEach(card => {
            sum+=card.value;
        });
        return sum;
    }

    addCard(newCard){
        this.hand.push(newCard);
    }
}

module.exports = BlackJackPlayer;