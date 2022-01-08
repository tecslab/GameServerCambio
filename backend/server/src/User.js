/**
 * Copyright 2020 Anicet Nougaret & contributors
 * See LICENCE.txt
 */

const Card = require('./Card');

class User {
    id = "";
    ws = null;
    name = "";
    type = "";
    position = "";
    rooms = {};
    initialCards = 4;
    cardsLimit=6;
    cartas = []; //{location:location,card:Card{}}

    constructor(id, name, ws) {
        this.id = id;
        this.name = name;
        this.ws = ws;
    }

    sendData(data) {
        this.ws.send(JSON.stringify(data))
        console.log("Sending to "+ this.id + "|" + this.name + ": " + JSON.stringify(data))
    }

    joinRoom(room) {
        let permitted = room.join(this)
        if(permitted) {
            this.rooms[room.id] = room
        }
        return permitted
    }

    onDeleted() {
        for(let id in this.rooms) {
            this.rooms[id].onUserLeft(this)
        }
    }

    toNetworkData() {
        return {
            name: this.name,
            id: this.id
        }
    }

    //Métodos para jugar

    onStart(position) {
        for (let i=0; i<this.initialCards; i++){
            let cardInstance = {location: i , card:new Card};
            this.cartas.push(cardInstance);
        }
        for (let i=this.initialCards;i<this.cardsLimit; i++){
            let cardInstance = {location: i , card: null};
            this.cartas.push(cardInstance);
        }
        this.position = position;
    }

    pushCard(location, card){
        let cardIndex = this.cartas.findIndex(card=>card.location==location);
        this.cartas[cardIndex].card = card;
    }

    getCard(location){
        let datosCarta = this.cartas.find(card=>card.location===location);
        return datosCarta.card;
    }

    deleteCard(location){
        let cardIndex = this.cartas.findIndex(card=>card.location==location);
        this.cartas[cardIndex].card = null;
    }

    suma(){
        let suma=0;
        for (let i in this.cartas){
            let costoCard = this.cartas[i].card?this.cartas[i].card.costo:0;
            suma += costoCard;
        }
        return suma;
    }
}

module.exports = User