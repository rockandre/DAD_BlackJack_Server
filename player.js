/*jshint esversion: 6 */
'use strict';

'use strict';

const Card = require('./card.js');
let hands = new WeakMap();

class BlackJackPlayer {

    constructor(Name) {
        this.name = Name;
        this.stand = 0;
        this.pubHand = [];
        var privateProperties = {
            hand: []
        };
        hands.set(this,privateProperties);
    }
    
    handSum(){
        let sum = 0;
        hands.get(this).hand.forEach(card => {
            sum+=card.value;
        });
        return sum;
    }

    showHand(){
        //console.log("playerHand: ");
        //console.log(hands.get(this).hand);
        return hands.get(this).hand;
    }

    addCard(newCard){
        //console.log("New card: "+newCard);
        //console.log("Player hand: "+hands.get(this).hand);
        console.log("ARR LENGTH: "+hands.get(this).hand.length);
        console.log(hands.get(this).hand);
        if(hands.get(this).hand.length==0){
            //console.log("weakmap empty");
            this.pubHand.push(newCard);
        } else {
            //console.log("weakmap not empty");
            this.pubHand.push(new Card("semFace",0));
        }
        let privatePropertiesChanger = hands.get(this);
        privatePropertiesChanger.hand.push(newCard);
        hands.set(this,privatePropertiesChanger);
        //console.log("added a card, and new hand is: ");
        //console.log(hands.get(this).hand);
    }

}

module.exports = BlackJackPlayer;
