"use strict";
function pierwszyLeksykPasazer() {
    let lista = document.getElementById('list_pas2');
    let pasazerowie = lista.getElementsByClassName('pas');
    let ans = 0;
    for (let i = 0; i < pasazerowie.length; i++) {
        let a = pasazerowie[i].getAttribute('data-identyfikator-pasazera');
        let b = pasazerowie[ans].getAttribute('data-identyfikator-pasazera');
        if (a < b) {
            ans = i;
        }
    }
    console.log(pasazerowie[ans].textContent);
}
pierwszyLeksykPasazer();
function czekaj(czas) {
    return new Promise(lambda => setTimeout(lambda, czas));
}
function teczoweKolory(el) {
    czekaj(1000)
        .then(() => console.log('red'))
        .then(() => el.style.backgroundColor = 'red')
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'orange'))
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'yellow'))
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'green'))
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'blue'))
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'indigo'))
        .then(() => czekaj(1000)
        .then(() => el.style.backgroundColor = 'purple'));
}
let przyklad = document.getElementById('nr_lotu');
teczoweKolory(przyklad);
