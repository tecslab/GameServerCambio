//Se definen las cartas y sus probabilidades
// set of object with probabilities:
//deberían sumar 1 si se busca que sea preciso
let cardsSet = [
    {name:'1', probabilidad: 4 / 54, costo:1, efecto:'None'},
    {name:'2', probabilidad: 4 / 54, costo:2, efecto:'None'},
    {name:'3', probabilidad: 4 / 54, costo:3, efecto:'None'},
    {name:'4', probabilidad: 4 / 54, costo:4, efecto:'None'},
    {name:'5', probabilidad: 4 / 54, costo:5, efecto:'None'},
    {name:'6', probabilidad: 4 / 54, costo:6, efecto:'None'},
    {name:'7', probabilidad: 4 / 54, costo:7, efecto:'CartaAjena'},
    {name:'8', probabilidad: 4 / 54, costo:8, efecto:'CartaAjena'},
    {name:'9', probabilidad: 4 / 54, costo:9, efecto:'CartaPropia'},
    {name:'10', probabilidad: 4 / 54, costo:10, efecto:'CartaPropia'},
    {name:'J', probabilidad: 4 / 54, costo:10, efecto:'CambioCiego'},
    {name:'Q', probabilidad: 4 / 54, costo:10, efecto:'CambioCiego'},
    {name:'KN', probabilidad: 2 / 54, costo:13, efecto:'Cambio'},
    {name:'KR', probabilidad: 2 / 54, costo:-1, efecto:'None'},
    {name:'JKR', probabilidad: 2 / 54, costo:0, efecto:'None'},
]

// Se obtiene la suma para incluir casos 
// en los que no sea uno:
let sum = 0;
for (let j in cardsSet) {
    sum += cardsSet[j].probabilidad;
}

//Función para obtener un evento aleatorio a partir
//de una función de densidad de probabilidad
//Basado en una funcion de distribución de probabilidad acumulativa
module.exports = function pickRandom() {
    var pick = Math.random() * sum;
    for (let j in cardsSet) {
        pick -= cardsSet[j].probabilidad;
        if (pick <= 0) {
            return cardsSet[j];
        }
    }
}