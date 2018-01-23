/*jshint esversion: 6 */

const Card = require('./card.js');

class BlackJackPlayer {
    constructor(Name) {
        this.name = Name;
        let hand = [];
        this.stand = 0;
        this.pubHand = [];
    }

    handSum(){
        sum = 0;
        this.hand.forEach(card => {
            sum+=card.value;
        });
        return sum;
    }

    addCard(newCard){
        hand.push(newCard);
        if(hand.size()==0){
            this.pubHand.push(newCard);
        } else {
            this.pubHand.push(new Card("semFace",0));
        }
    }

}

module.exports = BlackJackPlayer;