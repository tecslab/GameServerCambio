const randomCard = require('./randomCard');

class Card{
  name="";
  costo= null;
  owner="";
  position ="";

  constructor(owner, position){
    let carta = this.crearRandom();
    this.name = carta.name;
    this.costo = carta.costo;
    this.owner = owner; // Ower puede ser el id del jugador, el mazo o el descarte (Da información de a donde pertenece)
    this.position = position
  }

  crearRandom(){
    let carta = randomCard();
    return carta;
  }
}

module.exports = Card;