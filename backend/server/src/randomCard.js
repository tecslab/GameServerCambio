//Se definen las cartas y sus probabilidades
// set of object with probabilities:
//deberían sumar 1 si se busca que sea preciso
let set = { 1: 4 / 54, 2: 4 / 54, 3: 4 / 54, 4: 4 / 54, 5: 4 / 54, 6: 4 / 54, 7: 4 / 54, 8: 4 / 54, 9: 4 / 54, 10: 4 / 54, J: 4 / 54, Q: 4 / 54, KN: 2 / 54, KR: 2 / 54, JKR: 2 / 54 };


let cardsSet = [
    {name:'1', probabilidad: 4 / 54, costo:1},
    {name:'2', probabilidad: 4 / 54, costo:2},
    {name:'3', probabilidad: 4 / 54, costo:3},
    {name:'4', probabilidad: 4 / 54, costo:4},
    {name:'5', probabilidad: 4 / 54, costo:5},
    {name:'6', probabilidad: 4 / 54, costo:6},
    {name:'7', probabilidad: 4 / 54, costo:7},
    {name:'8', probabilidad: 4 / 54, costo:8},
    {name:'9', probabilidad: 4 / 54, costo:9},
    {name:'10', probabilidad: 4 / 54, costo:10},
    {name:'J', probabilidad: 4 / 54, costo:10},
    {name:'Q', probabilidad: 4 / 54, costo:10},
    {name:'KN', probabilidad: 2 / 54, costo:13},
    {name:'KR', probabilidad: 2 / 54, costo:-1},
    {name:'JKR', probabilidad: 2 / 54, costo:0},
]

// Se obtiene la suma para incluir casos 
// en los que no sea uno:
let sum = 0;
for (let j in set) {
    sum += set[j];
}

//Función para obtener un evento aleatorio a partir
//de una función de densidad de probabilidad
//Basado en una funcion de distribución de probabilidad acumulativa
module.exports = function pick_random() {
    var pick = Math.random() * sum;
    for (let j in set) {
        pick -= set[j];
        if (pick <= 0) {
            return j;
        }
    }
}