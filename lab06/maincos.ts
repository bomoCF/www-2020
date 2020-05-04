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

function wyswietlobrazek(url : string) {
  console.log(url);

  let nowyEl = document.createElement('img');
  nowyEl.src = url;
  document.body.insertBefore(nowyEl, document.getElementById('end-body'));
}

ostatnieZdjecie()

// let opuznienia = document.getElementById('lista_opuznien') as HTMLElement;
// opuznienia.addEventListener('click', koloruj);

// let formularz = document.getElementById('formularz') as HTMLElement;
// formularz.addEventListener('click', koloruj);

let opuznienia = document.getElementById('grid-item3') as HTMLElement;
opuznienia.addEventListener('click', koloruj);

let cnt = 0;
function koloruj(event: MouseEvent) {
  cnt = cnt + 1;
  console.log(fib_rek(cnt));
  let element = event.target as HTMLElement;

  let kolor = window
  .getComputedStyle(element)
  .getPropertyValue('background-color');

  console.log(kolor);

  let tmp =
      /rgb[a]?\((\d+),[^0-9]*(\d+),[^0-9]*(\d+)[,]?[^0-9]*(\d*)\)/
      .exec(kolor) as RegExpExecArray;

  let [_,...koloryRgb] = tmp;

  let kolory: number[] = [];
  for(let i = 0; i < 3; i++) {
    kolory[i] = (parseInt(koloryRgb[i]) + 0x16) % 256;
  }

  element.style.backgroundColor = `rgb(${kolory[0]},${kolory[1]},${kolory[2]})`;
}

function fib_rek(ile : number) : number {
  if(ile == 0) return 0;
  if(ile == 1) return 1;
  return fib_rek(ile - 1) + fib_rek(ile - 2);
}

let pokarz_submit = document.getElementById('formularz') as HTMLElement;
pokarz_submit.addEventListener('click', czy_pokazac_submit);

function czy_pokazac_submit() {
  let przycisk = document.getElementById('submit-form') as HTMLElement;
  przycisk.style.visibility = 'hidden';

  let fname = document.getElementById('fname') as HTMLInputElement;
  if(fname.value === "") return;

  let fsurname = document.getElementById('fsurname') as HTMLInputElement;
  if(fsurname.value === "") return;

  let fdate = document.getElementById('fdate') as HTMLInputElement;
  let podana_data = new Date(Date.parse(fdate.value));
  let aktualna_data = new Date(Date.now());

  if(podana_data >= aktualna_data) {
    przycisk.style.visibility = 'visible';
  }
}

function wypisz_rezerwacje() {
  let popup = document.getElementById('rezerwacja-popup') as HTMLElement;
  popup.style.visibility = "visible";

  let tekst = "Rezerwacja udana<br>";

  let imie = document.getElementById('fname') as HTMLInputElement;
  tekst += "imie: " + imie.value + "<br>";

  let nazwisko = document.getElementById('fsurname') as HTMLInputElement;
  tekst += "nazwisko: " + nazwisko.value + "<br>";

  let data = document.getElementById('fdate') as HTMLInputElement;
  tekst += "data: " + data.value + "<br>";

  let skad = document.getElementById('ffrom') as HTMLInputElement;
  tekst += "skąd: " + skad.value + "<br>";

  let dokad = document.getElementById('fto') as HTMLInputElement;
  tekst += "dokąd: " + dokad.value + "<br>";

  popup.innerHTML = tekst;
}