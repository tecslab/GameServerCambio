/**
 * Copyright 2020 Anicet Nougaret & contributors
 * See LICENCE.txt
 */

module.exports = {
    // Management messages
    YOUR_ID: (id, name) => ({message:"Your id", id: id, name: name}),
    JOINED_ROOM: (roomId, usersND) => ({message:"Joined room", roomId:roomId, usersND:usersND}),
    FAILED_TO_JOIN_ROOM: (reason) => ({message: "Failed to join room", reason: reason}),
    USER_JOINED: (roomId, userND) => ({message:"User joined", roomId:roomId, userND:userND}),
    USER_LEFT: (roomId, userId) => ({message:"User left", roomId:roomId, userId:userId}),
    UPDATE_HOST: (roomId, userId) => ({message:"Update host", roomId:roomId, userId:userId}),
    ROOM_DELETED: (roomId) => ({message:"Game deleted", roomId:roomId}),
    GAME_STARTED: (roomId) => ({message:"Game started", roomId:roomId}),
    // Game messages
    CARTA_INICIAL: {message:"Ver carta inicial"},
    MOSTRAR_CARTA: (card) => ({message:"Mostrar carta", card: card}),
    PINTAR_CARTAS: (cards) => ({message:"Pintar cartas", cards})
    CAMBIAR_CARTAS: (card1, card2) => ({message:"Cambio de cartas", card1, card2}), //Para mostrar a los jugadores que cartas se cambiaron
    DESCARTAR_CARTAS: (card1, card2) => ({message:"Cambio de cartas", card1, card2}),
    TURNO_ETAPA1: (token, turnoCount, card) => ({message:"Turno etapa 1", token, turnoCount, card}),
    TURNO_ETAPA2: {message:"Turno etapa 2"},
    ULTIMO_TURNO: {message:"Ultimo turno"},
    FINALIZAR: (resultados) => ({message:"Fin", resultados})
} 