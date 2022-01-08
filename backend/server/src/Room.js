/**
 * Copyright 2020 Anicet Nougaret & contributors
 * See LICENCE.txt
 */

const englishWordGen = require('./wordGen')
const messages = require('./messages')
const Card = require('./Card');
const Descarte = require('./Descarte');

class Room {
    id = englishWordGen()[0];
    users = [];
    usersStates = {};
    maxUsers = 4;
    started = false;
    //positions = ['Pos1', 'Pos2', 'Pos3', 'Pos4'];
    frontMazoCard = null;
    descarte = {};
    turnCount = 0;
    turnToken = 0; // token del turno actual. Valores desde 0 a maxUser - 1

    constructor() {}

    sendDataToEveryone(data) {
        this.users.forEach(u => u.sendData(data))
    }

    join(user) {
        if(this.users.indexOf(user) != -1) return false
        user.sendData(messages.JOINED_ROOM(this.id, this.getUsersND()))
        this.users.push(user)
        this.usersStates[user.id] = {}
        this.sendDataToEveryone(messages.USER_JOINED(this.id, this.getUserND(user)))
        return true
    }

    onUserLeft(user) {
        this.sendDataToEveryone(messages.USER_LEFT(this.id, user.id));
        this.users.splice(this.users.indexOf(user), 1);
    }

    onStart() {
        this.started = true;
        this.sendDataToEveryone(messages.GAME_STARTED(this.id));
        this.frontMazoCard = new Card;
        this.descarte = new Descarte();
        this.users.map((user,index) => user.onStart(index));
    }

    onDeleted() {
        this.sendDataToEveryone(messages.ROOM_DELETED(this.id))
        this.users.forEach(u => delete u.rooms[this.id])
    }

    getUsersND() {
        return this.users.map(u => this.getUserND(u))
    }

    getUserND(user) {
        return {...user.toNetworkData()/*, ...this.usersStates[user.id]*/}
    }

    isHost(user) {
        return this.users.indexOf(user) == 0
    }

    getHost() {
        return this.users[0]
    }

    //******  Métodos del juego  *******

    nextToken(prevToken){
        // Genera un token actualizado
        let lastPosition= this.maxUsers-1;
        if (prevToken === lastPosition){
            return 0;
        }else{
            return prevToken + 1;
        }
    }

    onFinish(){
        let puntajes = [];
        this.users.map(user=> puntajes.push({name:user.name, value:user.suma()}) );
        return puntajes;
    }

    getMazoCard(){
        this.frontMazoCard = new Card;
    }

    localizarCarta(idLugar, location){
        //Encuentra el valor de la carta en la posición solicitada
        //idLugar puede ser mazo, descarte o un id de un Jugador
        let carta={}
        let owner;
        switch(idLugar){
            case 'mazo':
                carta = this.frontMazoCard;
                break;
            case 'descarte':
                carta = this.descarteCard;
                break;
            default:
                // La carta tiene id de jugador(user)
                owner = this.users.find(user => user.id === idLugar);
                carta = owner.getCard(location);
                break;
        }
        return carta;
    }

    pushCard(idLugar, location, card){
        let owner;
        switch(idLugar){
            case 'mazo':
            //Si el cambio es con el mazo la carta va al descarte
                this.descarte.pushCard(card);
                this.frontMazoCard = null;
                break;
            case 'descarte':
                this.descarte.pushCard(card);
                break;
            default:
                // La carta tiene id de jugador(user)
                owner = this.users.find(user => user.id === idLugar);
                owner.pushCard(location,card);
                break;
        }
    }

    cambiarCartas(datosCarta1, datosCarta2){
        //Se puede cambiar entre 2 cartas, entre 1 carta y el mazo o entre 1 carta y el descarte
        //datosCartaX {idLugar:user.id, location:cartas.location}
        let carta1 = this.localizarCarta(datosCarta1.idLugar, datosCarta1.location);
        let carta2 = this.localizarCarta(datosCarta2.idLugar, datosCarta2.location);
        this.pushCard(datosCarta1.idLugar, datosCarta1.location, carta2);
        this.pushCard(datosCarta2.idLugar, datosCarta2.location, carta1);
    }

    compararCartas(carta1, carta2){
        if (carta1.card===carta2.card){
            return true;
        }else{
            return false;
        }
    }
    
}

module.exports = Room