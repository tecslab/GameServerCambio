/**
 * Copyright 2020 Anicet Nougaret & contributors
 * See LICENCE.txt
 */

const englishWordGen = require('./wordGen')
const messages = require('./messages')

class Room {
    id = englishWordGen()[0];
    users = [];
    usersStates = {};
    maxUsers = 1024;
    started = false;
    positions = ['Pos1', 'Pos2', 'Pos3', 'Pos4'];
    frontMazoCard = null;
    descarteCard = null;
    turnCount = 0;
    turnToken = ""; // Guarda el nombre de la posición con el turno actual

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
        this.sendDataToEveryone(messages.USER_LEFT(this.id, user.id))
        this.users.splice(this.users.indexOf(user), 1)
    }

    onStart() {
        this.started = true
        this.sendDataToEveryone(messages.GAME_STARTED(this.id))
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
}

module.exports = Room