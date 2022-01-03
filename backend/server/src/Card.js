const randomCard = require('./randomCard');

class Card{
  name="";
  costo= null;
  efecto= "";

  constructor(){
    let carta = this.crearRandom();
    this.name = carta.name;
    this.costo = carta.costo;
    this.efecto = carta.efecto;
  }

  crearRandom(){
    let carta = randomCard();
    return carta;
  }
}

module.exports = Card;