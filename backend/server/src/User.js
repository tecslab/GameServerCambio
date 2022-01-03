/**
 * Copyright 2020 Anicet Nougaret & contributors
 * See LICENCE.txt
 */

const Card = require('./Card');

class User {
    id = "";
    ws = null;
    name = "";
    position = "";
    rooms = {};
    initialCards = 4;
    cardsLimit=6;
    cartas = [];

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
}

module.exports = User