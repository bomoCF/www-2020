"use strict";
// let el = document.getElementById('submit-form');
// let el = document.querySelector('input[name=fname]')
// let el = document.getElementById('test1')
// el.remove();
// console.log(el.textContent);
let nowyElement = document.createElement("div");
nowyElement.innerHTML = "dodane ze skryptu";
let staryEl = document.getElementById('end-body');
document.body.insertBefore(nowyElement, staryEl);
setTimeout(() => {
    console.log('No już wreszcie.');
}, 2000);
function ostatnieZdjecie() {
    const url = "https://api.github.com/repos/Microsoft/TypeScript/commits";
    fetch(url)
        .then(o => o.json())
        .then(o => o[0].author.avatar_url)
        .then(o => wyswietlobrazek(o))
        .catch(o => console.log("nie udalo sie: ", o));
}
function wyswietlobrazek(url) {
    console.log(url);
    let nowyEl = document.createElement('img');
    nowyEl.src = url;
    document.body.insertBefore(nowyEl, document.getElementById('end-body'));
}
ostatnieZdjecie();
// let opuznienia = document.getElementById('lista_opuznien') as HTMLElement;
// opuznienia.addEventListener('click', koloruj);
// let formularz = document.getElementById('formularz') as HTMLElement;
// formularz.addEventListener('click', koloruj);
let opuznienia = document.getElementById('aside_container');
opuznienia.addEventListener('click', koloruj);
let cnt = 0;
function koloruj(event) {
    cnt = cnt + 1;
    console.log(fib_rek(cnt));
    let element = event.target;
    let kolor = window
        .getComputedStyle(element)
        .getPropertyValue('background-color');
    console.log(kolor);
    let tmp = /rgb[a]?\((\d+),[^0-9]*(\d+),[^0-9]*(\d+)[,]?[^0-9]*(\d*)\)/
        .exec(kolor);
    let [_, ...koloryRgb] = tmp;
    let kolory = [];
    for (let i = 0; i < 3; i++) {
        kolory[i] = (parseInt(koloryRgb[i]) + 0x2) % 256;
    }
    element.style.backgroundColor = `rgb(${kolory[0]},${kolory[1]},${kolory[2]})`;
}
function fib_rek(ile) {
    if (ile == 0)
        return 1;
    if (ile == 1)
        return 1;
    return fib_rek(ile - 1) + fib_rek(ile - 2);
}
