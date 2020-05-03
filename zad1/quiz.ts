let json_dostalem = '{\
    "wstep":"To jest przykładowy wstęp do quizu.",\
    "pytania":\
        [{"tresc":"2 + 2","odpowiedz":"4","kara":"10"},\
        {"tresc":"2 * 2","odpowiedz":"4","kara":"5"},\
        {"tresc":"-18 / 9","odpowiedz":"-2","kara":"0"},\
        {"tresc":"1 + 1/2 + 1/4 + ...","odpowiedz":"2","kara":"17"}]\
    }';
// inicjalizacja
interface pytanie {
    tresc : string;
    odpowiedz : number;
    kara : number;
}
interface quiz {
    wstep : string;
    pytania : pytanie[];
}
let my_quiz = JSON.parse(json_dostalem) as quiz;
let wstep_html = document.getElementById('grid-wstep') as HTMLElement;
wstep_html.textContent = my_quiz.wstep;
let aktualne_pytanie = 0;
let odpowiedzi_urzytkownika : number[] = [];
let czasy_urzytkownika : number[] = [];
let timer = 0;
let czas_ostatniej_zmiany = 0;
let suma_czasow = 0;
for(let i = 0; i < my_quiz.pytania.length; i++) {
    odpowiedzi_urzytkownika[i] = NaN;
    czasy_urzytkownika[i] = 0;
}
wyswietl_pytanie(aktualne_pytanie);
setInterval(add_time, 10);
// koniec inicjalizacji

function koncz_wyswietlanie_pytania(pytanie_id : number) {
    czasy_urzytkownika[aktualne_pytanie] += (timer - czas_ostatniej_zmiany);
    czas_ostatniej_zmiany = timer;
}

function wyswietl_pytanie(pytanie_id : number) {
    let tresc_pytania = document.getElementById('grid-pytanie') as HTMLElement;
    tresc_pytania.textContent = "Oblicz: " + my_quiz.pytania[pytanie_id].tresc;

    let kara = document.getElementById('grid-kara') as HTMLElement;
    kara.textContent = "kara czasowa: " + my_quiz.pytania[pytanie_id].kara + "s";

    let nr_pytania = document.getElementById('grid-nr_pytania') as HTMLElement;
    nr_pytania.textContent = "pytanie: " + (pytanie_id + 1) + "/" + my_quiz.pytania.length;

    let odpowiedz = document.getElementById('grid-odpowiedz') as HTMLInputElement;
    if(isNaN(odpowiedzi_urzytkownika[pytanie_id])) odpowiedz.value = "";
    else odpowiedz.value = odpowiedzi_urzytkownika[pytanie_id].toString();
}

function poprzedni() {
    if(aktualne_pytanie == 0) return;

    koncz_wyswietlanie_pytania(aktualne_pytanie);
    aktualne_pytanie--;
    wyswietl_pytanie(aktualne_pytanie);
}

function nastepny() {
    if(aktualne_pytanie + 1 == my_quiz.pytania.length) return;

    koncz_wyswietlanie_pytania(aktualne_pytanie);
    aktualne_pytanie++;
    wyswietl_pytanie(aktualne_pytanie);
}

function add_time() {
    timer += 10;

    let czas = document.getElementById('grid-czas') as HTMLElement;
    czas.textContent = "quiz trwa: " + toSekund(timer) + " sekund";
}

function zakoncz_quiz() {
    koncz_wyswietlanie_pytania(aktualne_pytanie);
    let zakryj = document.getElementById('quiz_container') as HTMLElement;
    zakryj.style.display = 'none';

    let odslon = document.getElementById('report_container') as HTMLElement;
    odslon.style.display = 'grid';

    let ile_ok = 0;
    for(let i = 0; i < my_quiz.pytania.length; i++) {
        if(odpowiedzi_urzytkownika[i] != my_quiz.pytania[i].odpowiedz) {
            suma_czasow += my_quiz.pytania[i].kara * 1000;
        } else {
            ile_ok ++;
        }
    }

    let suma_kar = document.getElementById('grid-suma_kar') as HTMLElement;
    suma_kar.textContent = "Twoja kara czasowa wynosi: " + toSekund(suma_czasow) + " sekund";

    suma_czasow += timer;

    let wynik = document.getElementById('grid-wynik') as HTMLElement;
    wynik.textContent = "Twoj wynik wynosi: " + toSekund(suma_czasow) + " sekund";

    let odpowiedzi_ok = document.getElementById('grid-odpowiedzi_ok') as HTMLElement;
    odpowiedzi_ok.textContent = "Udzielono " + ile_ok + "/" + my_quiz.pytania.length + " dobrych odpowiedzi";

    let list = document.getElementById('grid-lista_pytan') as HTMLElement;
    for(let i = 0; i < my_quiz.pytania.length; i++) {
        if(odpowiedzi_urzytkownika[i] != my_quiz.pytania[i].odpowiedz) {
            let zle_odpowiedzi = document.getElementById('grid-zle_odpowiedzi') as HTMLElement;
            zle_odpowiedzi.style.display = 'inline';

            let new_list_el = document.createElement('li');
            let tekst = my_quiz.pytania[i].tresc + " wynosi " + my_quiz.pytania[i].odpowiedz.toString();
            tekst += ", a nie " + odpowiedzi_urzytkownika[i].toString();
            new_list_el.appendChild(document.createTextNode(tekst));
            list.appendChild(new_list_el);
        }
    }

    let wrapper_zapisz = document.getElementById('grid-wrapper_zapisz') as HTMLElement;
    wrapper_zapisz.style.display = 'inline';

    let end_raport = document.getElementById('grid-end_raport') as HTMLElement;
    end_raport.style.display = 'grid';
    end_raport.style.backgroundColor = "rgb(158, 199, 45)";
}

function uaktualnij_odpowiedzi() {
    let odpowiedz = document.getElementById('grid-odpowiedz') as HTMLInputElement;
    if(isNaN(Number(odpowiedz.value))) return;
    if(odpowiedz.value == "") return;
    odpowiedzi_urzytkownika[aktualne_pytanie] = Number(odpowiedz.value);

    nastepny();

    for(let i = 0; i < odpowiedzi_urzytkownika.length; i++) {
        if(isNaN(odpowiedzi_urzytkownika[i])) {
            let zakoncz = document.getElementById('grid-zakoncz') as HTMLElement;
            zakoncz.style.display = 'none';
            return;
        }
    }

    let zakoncz = document.getElementById('grid-zakoncz') as HTMLElement;
    zakoncz.style.display = 'inline';
}

function toSekund(milisekundy : number) {
    return (milisekundy / 1000).toFixed(1);
}

function end_raport() {
    let checkbox = document.getElementById('grid-zapisz') as HTMLInputElement;

    let dlugosc_wynikow = Number(localStorage.getItem('dlugosc'));
    localStorage.removeItem('dlugosc');
    localStorage.setItem("wynik" + dlugosc_wynikow.toString(), suma_czasow.toString());
    if(checkbox.checked) {
        let staty = {suma_czasow, odpowiedzi_urzytkownika, czasy_urzytkownika};
        localStorage.setItem("staty" + dlugosc_wynikow.toString(), JSON.stringify(staty));
    }
    dlugosc_wynikow ++;
    localStorage.setItem("dlugosc", dlugosc_wynikow.toString());
    let str = window.location.pathname.split("/");
    str[str.length - 1] = "start.html";

    let new_str = "";
    for(let i = 0; i < str.length; i++) {
        new_str += str[i];
        if(i + 1 != str.length) new_str += "/";
    }

    window.location.pathname = new_str;
}