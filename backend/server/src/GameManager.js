const Card = require('./Card');
const Descarte = require('./Descarte');

class GameManager{
  players=[];
  motorFases={};
  frontMazoCard = null;
  descarte = {};
  turnCount = 0;
  turnToken = 0; // token del turno actual. Valores desde 0 a maxUser - 1

  constructor(players){
    this.players = players;
    this.motorFases = new MotorFases();
    this.frontMazoCard = new Card;
    this.descarte = new Descarte();
  }

  handleMessage(player, data) {
    let message = data.message;
    switch (message){
      case 'cartaInicial':
        this.verCartaInicial(player);
        break;
    }

  }

  verCartaInicial(player, data){
    let {cardLocation, fase} = data;
    if (fase===this.motorFases.getFaseActual()){
      let card = player.getCard(cardLocation);
      player.sendData(card);
    }   
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
      if (carta1.card.name===carta2.card.name){
          return true;
      }else{
          return false;
      }
  }
}

class MotorFases{

  fasesJuego = ['preJuego', 'Juego', 'ultimaRonda', 'Fin'];
  indexFaseActual = 0;

  constructor(){}

  avanzar(){
    this.indexFaseActual += 1;
  }

  getFaseActual(){
    return this.fasesJuego[this.indexFaseActual];
  }
}

module.exports = GameManager;