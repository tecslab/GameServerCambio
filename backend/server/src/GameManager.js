const Card = require('./Card');
const Descarte = require('./Descarte');
const timeEtapa1 = 5000;
const timeEtapa2 = 5000;
const timePreJuego = 8000; //tiempo en milisegundos que dura el prejuego
const timeToSelectCard = 5000;
const messages = require('./messages');

class GameManager{
  players=[];
  room={};
  motorFases={};
  frontMazoCard = null;
  descarte = {};
  descarteActivo = false; // Si está activo se puede tomar la carta que está en el descarte
  turnCount = 0;
  turnToken = 0; // token del turno actual. Valores desde 0 a maxUser - 1
  jugando = true; // se setea en false después del último turno
  etapa1 = false;
  etapa2 = false;
  intervaloEtapa2 = ";"

  constructor(room){
    this.players = room.users;
    this.room = room;
    this.motorFases = new MotorFases();
    //this.frontMazoCard = new Card;
    this.descarte = new Descarte();
  }

  handleMessage(player, data) {
    let { command } = data;
    switch (command){
      case 'cartaInicial':
        this.verCartaInicial(player);
        break;
      case 'accionEtapa1':
        //recibe la acción que tomó el jugador de turno con la carta que obtuvo del mazo o descarte
        this.accionEtapa1(player, data);
        break;
      case 'segundaAccionKN': // Segunda acción de KN es cambiar cartas
        this.segundaAccionKN(data);
        break;
      case 'emparejarCartas':
        //En la segunda etapa del turno los jugadores pueden intentar emparejar una carta con el descarte
        // si las cartas son iguales, se elimina una de sus cartas
        this.emparejarCartas(player, data);
        break;
      case 'pasarCarta':
        this.pasarCarta(player, data.player.id, data);
        break;
    }
  }

  verCartaInicial(player, data){
    let {cardLocation} = data;
    if (this.motorFases.fasesJuego[0]===this.motorFases.getFaseActual()){
      // Valida que sea durante el prejuego
      let card = player.getCard(cardLocation).card;
      player.sendData(card);
    }
  }

  startGame(){
    setTimeout(() => {
      //En este tiempo se recibirán la carta que quiere ver de inicio el jugador
      this.etapa1 = true;
      this.motorFases.avanzar();
      this.bodyGame();
    },timePreJuego);
    this.room.sendDataToEveryone(messages.CARTA_INICIAL);
  }

  bodyGame(){
    while (this.jugando === true){
      this.frontMazoCard = new Card(); 
      this.room.sendDataToEveryone(messages.TURNO_ETAPA1(this.turnToken, this.turnCount, this.frontMazoCard));
      setTimeout(()=>{
        this.etapa1=false;
      },timeEtapa1);
      while (this.etapa1===true){
        //Espera ha que pase la etapa1 del turno
      }
      //Etapa2
      this.descarteActivo = true;
      this.intervaloEtapa2 = setTimeout(()=>{
        this.etapa2=false;
      },timeEtapa2);
      while (this.etapa2===true){
        // Espera hasta que etapa2 sea falso
      }
      //actualizar el token
    }
  }

  accionEtapa1(player, data){
    let { accion, ubicacionCarta1, ubicacionCarta2 } = data;
    this.room.sendDataToEveryone(messages.PINTAR_CARTAS([ubicacionCarta1, ubicacionCarta2])); // se muestra a todos los demás la ubicación
    // de las cartas que se refieren a la acción del jugador
    if ( accion === "descartar"){
      // Si es descarte, carta1 va al descarte, la carta2 no existe
      ubicacionCarta2 = {idLugar: 'descarte'};
      this.cambiarCartas(ubicacionCarta1, ubicacionCarta2);
    }else if( accion === "cambiar"){
      // puede ser cambio entre 2 cartas (por carta de efecto de cambio),
      // descarte de carta propia para reemplazarla por la carta que salio en el mazo,
      // o cambio de la carta del descarte por una propia
      this.cambiarCartas(ubicacionCarta1, ubicacionCarta2);
    }else if( accion === "mostrar"){
      // puede ser una carta propia o una ajena
      let carta = this.localizarCarta(ubicacionCarta1).carta;
      player.sendData(carta);
      if ( this.frontMazoCard.name === "KN" ){
        //Al jugador se le envía el valor de la carta
        //Se podría implementar aqui un clearTimeout y otro setTimeout para alargar el tiempo para cambiar las cartas
      }else{
        this.etapa1 = false;
        this.etapa2 = true;
      }
    }
    this.frontMazoCard = null;
  }

  segundaAccionKN(data){
    // Cuando aparece una KN se realizan 2 acciones
    let {ubicacionCarta1, ubicacionCarta2} = data;
    this.room.sendDataToEveryone(messages.PINTAR_CARTAS([ubicacionCarta1, ubicacionCarta2]));
    this.cambiarCartas(ubicacionCarta1, ubicacionCarta2);
    this.etapa1 = false;
    this.etapa2 = true;
  }

  emparejarCartas(player, data){
    //si la carta es igual al descarte, se descarta, si no, el jugador se penaliza con una carta extra
    if (this.descarteActivo === true){
      let { ubicacionCarta } = data;
      let datosCarta = this.localizarCarta(ubicacionCarta);
      let comparacion = this.compararCartas(datosCarta.carta, this.descarte);
      if (comparacion === true){
        this.descarteActivo = false;
        datosCarta.owner.deleteCard();
        if (datosCarta.owner.id !== player.id ){
          //this.pasarCarta(datosCarta.owner, player, data);
          // Limpia el intervalo para el término de la segunda etapa y da un tiempo extra
          // para que el jugador selecciona su carta que será enviada al otro jugador
          clearInterval(this.intervaloEtapa2);
          setTimeout(()=>{
            let datosNulos = null;
            this.pasarCarta(datosCarta.owner, player.id, datosNulos); // pasa al otro jugador una carta aleatoria
            this.etapa2 = false;
          }, timeToSelectCard);
        }else{
          this.etapa2 = false;
        }
      }else{
        player.penaltyCard();
      }
    }    
  }

  pasarCarta(owner, secondPlayerID, data){
    // puede ser una carta seleccionada o al azar
    let { ubicacionCarta } = data;
    let secondPlayer = this.findPlayerByID(secondPlayerID);
    let card = {};
    if (ubicacionCarta === null || ubicacionCarta === undefined){
      card = owner.getRandomCard();
    }else{
      card = owner.getCard(ubicacionCarta);
      this.etapa2 = false;
    }
    secondPlayer.pushCard(card.location, card.card);
  }

  findPlayerByID(playerID){
    let player = this.players.find(player => player.id === playerID);
    return player;
  }

  
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
      let carta={};
      let owner;
      switch(idLugar){
          case 'mazo':
              carta = this.frontMazoCard;
              break;
          case 'descarte':
              carta = this.descarte;
              break;
          default:
              // La carta tiene id de jugador(user)
              owner = this.users.find(user => user.id === idLugar);
              carta = owner.getCard(location).card;
              break;
      }
      return { carta, owner};
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
    //lugar: posicion del jugador en la mesa, location: posicion de la carta del jugador
    let carta1 = this.localizarCarta(datosCarta1.idLugar, datosCarta1.location).carta;
    let carta2 = this.localizarCarta(datosCarta2.idLugar, datosCarta2.location).carta;
    this.pushCard(datosCarta1.idLugar, datosCarta1.location, carta2);
    this.pushCard(datosCarta2.idLugar, datosCarta2.location, carta1);
  }

  compararCartas(carta1, carta2){
      if (carta1.card.name===carta2.card.name){
          return true;
      }else{
          return false;
      }
  }
}

// ¨*************************************************
//             Implementa motor de fases
// ¨*************************************************

class MotorFases{
  //  [INICIO, CUERPO, FINAL], El cuerpo se conforma por un bucle de etapas 1 y etapas 2
  fasesJuego = ['preJuego', 'etapa1', 'etapa2', 'ultimaRonda', 'Fin'];
  indexFaseActual = 0;

  //constructor(){}
  constructor(){
  }

  avanzar(){
    if (this.fasesJuego[this.indexFaseActual]==="etapa2"){
      this.indexFaseActual = 1;  
    }else{
      this.indexFaseActual += 1;
    }
  }

  ultimaRonda(){
    this.indexFaseActual = 3;
  }

  getFaseActual(){
    return this.fasesJuego[this.indexFaseActual];
  }

}

module.exports = GameManager;