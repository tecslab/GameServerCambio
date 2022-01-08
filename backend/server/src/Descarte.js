class Descarte{
  frontCard=null;

  constructor(){
  }

  getCard(){return this.frontCard}

  pushCard(card){
    this.frontCard=card;
  }
}

module.exports = Descarte;