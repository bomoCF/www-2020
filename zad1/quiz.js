"use strict";
var json_dostalem = '{\
    "wstep":"To jest przykładowy wstęp do quizu.",\
    "pytania":\
        [{"tresc":"2 + 2","odpowiedz":"4","kara":"10"},\
        {"tresc":"2 * 2","odpowiedz":"4","kara":"5"},\
        {"tresc":"-18 / 9","odpowiedz":"-2","kara":"0"},\
        {"tresc":"1 + 1/2 + 1/4 + ...","odpowiedz":"2","kara":"17"}]\
    }';
var my_quiz = JSON.parse(json_dostalem);
var wstep_html = document.getElementById('grid-wstep');
wstep_html.textContent = my_quiz.wstep;
var aktualne_pytanie = 0;
var odpowiedzi_urzytkownika = [];
var czasy_urzytkownika = [];
var timer = 0;
var czas_ostatniej_zmiany = 0;
var suma_czasow = 0;
for (var i = 0; i < my_quiz.pytania.length; i++) {
    odpowiedzi_urzytkownika[i] = NaN;
    czasy_urzytkownika[i] = 0;
}
wyswietl_pytanie(aktualne_pytanie);
setInterval(add_time, 10);
// koniec inicjalizacji
function koncz_wyswietlanie_pytania(pytanie_id) {
    czasy_urzytkownika[aktualne_pytanie] += (timer - czas_ostatniej_zmiany);
    czas_ostatniej_zmiany = timer;
}
function wyswietl_pytanie(pytanie_id) {
    var tresc_pytania = document.getElementById('grid-pytanie');
    tresc_pytania.textContent = "Oblicz: " + my_quiz.pytania[pytanie_id].tresc;
    var kara = document.getElementById('grid-kara');
    kara.textContent = "kara czasowa: " + my_quiz.pytania[pytanie_id].kara + "s";
    var nr_pytania = document.getElementById('grid-nr_pytania');
    nr_pytania.textContent = "pytanie: " + (pytanie_id + 1) + "/" + my_quiz.pytania.length;
    var odpowiedz = document.getElementById('grid-odpowiedz');
    if (isNaN(odpowiedzi_urzytkownika[pytanie_id]))
        odpowiedz.value = "";
    else
        odpowiedz.value = odpowiedzi_urzytkownika[pytanie_id].toString();
}
function poprzedni() {
    if (aktualne_pytanie == 0)
        return;
    koncz_wyswietlanie_pytania(aktualne_pytanie);
    aktualne_pytanie--;
    wyswietl_pytanie(aktualne_pytanie);
}
function nastepny() {
    if (aktualne_pytanie + 1 == my_quiz.pytania.length)
        return;
    koncz_wyswietlanie_pytania(aktualne_pytanie);
    aktualne_pytanie++;
    wyswietl_pytanie(aktualne_pytanie);
}
function add_time() {
    timer += 10;
    var czas = document.getElementById('grid-czas');
    czas.textContent = "quiz trwa: " + toSekund(timer) + " sekund";
}
function zakoncz_quiz() {
    koncz_wyswietlanie_pytania(aktualne_pytanie);
    var zakryj = document.getElementById('quiz_container');
    zakryj.style.display = 'none';
    var odslon = document.getElementById('report_container');
    odslon.style.display = 'grid';
    var ile_ok = 0;
    for (var i = 0; i < my_quiz.pytania.length; i++) {
        if (odpowiedzi_urzytkownika[i] != my_quiz.pytania[i].odpowiedz) {
            suma_czasow += my_quiz.pytania[i].kara * 1000;
        }
        else {
            ile_ok++;
        }
    }
    var suma_kar = document.getElementById('grid-suma_kar');
    suma_kar.textContent = "Twoja kara czasowa wynosi: " + toSekund(suma_czasow) + " sekund";
    suma_czasow += timer;
    var wynik = document.getElementById('grid-wynik');
    wynik.textContent = "Twoj wynik wynosi: " + toSekund(suma_czasow) + " sekund";
    var odpowiedzi_ok = document.getElementById('grid-odpowiedzi_ok');
    odpowiedzi_ok.textContent = "Udzielono " + ile_ok + "/" + my_quiz.pytania.length + " dobrych odpowiedzi";
    var list = document.getElementById('grid-lista_pytan');
    for (var i = 0; i < my_quiz.pytania.length; i++) {
        if (odpowiedzi_urzytkownika[i] != my_quiz.pytania[i].odpowiedz) {
            var zle_odpowiedzi = document.getElementById('grid-zle_odpowiedzi');
            zle_odpowiedzi.style.display = 'inline';
            var new_list_el = document.createElement('li');
            var tekst = my_quiz.pytania[i].tresc + " wynosi " + my_quiz.pytania[i].odpowiedz.toString();
            tekst += ", a nie " + odpowiedzi_urzytkownika[i].toString();
            new_list_el.appendChild(document.createTextNode(tekst));
            list.appendChild(new_list_el);
        }
    }
    var wrapper_zapisz = document.getElementById('grid-wrapper_zapisz');
    wrapper_zapisz.style.display = 'inline';
    var end_raport = document.getElementById('grid-end_raport');
    end_raport.style.display = 'grid';
    end_raport.style.backgroundColor = "rgb(158, 199, 45)";
}
function uaktualnij_odpowiedzi() {
    var odpowiedz = document.getElementById('grid-odpowiedz');
    if (isNaN(Number(odpowiedz.value)))
        return;
    if (odpowiedz.value == "")
        return;
    odpowiedzi_urzytkownika[aktualne_pytanie] = Number(odpowiedz.value);
    nastepny();
    for (var i = 0; i < odpowiedzi_urzytkownika.length; i++) {
        if (isNaN(odpowiedzi_urzytkownika[i])) {
            var zakoncz_1 = document.getElementById('grid-zakoncz');
            zakoncz_1.style.display = 'none';
            return;
        }
    }
    var zakoncz = document.getElementById('grid-zakoncz');
    zakoncz.style.display = 'inline';
}
function toSekund(milisekundy) {
    return (milisekundy / 1000).toFixed(1);
}
function end_raport() {
    var checkbox = document.getElementById('grid-zapisz');
    var dlugosc_wynikow = Number(localStorage.getItem('dlugosc'));
    localStorage.removeItem('dlugosc');
    localStorage.setItem("wynik" + dlugosc_wynikow.toString(), suma_czasow.toString());
    if (checkbox.checked) {
        var staty = { suma_czasow: suma_czasow, odpowiedzi_urzytkownika: odpowiedzi_urzytkownika, czasy_urzytkownika: czasy_urzytkownika };
        localStorage.setItem("staty" + dlugosc_wynikow.toString(), JSON.stringify(staty));
    }
    dlugosc_wynikow++;
    localStorage.setItem("dlugosc", dlugosc_wynikow.toString());
    var str = window.location.pathname.split("/");
    str[str.length - 1] = "start.html";
    var new_str = "";
    for (var i = 0; i < str.length; i++) {
        new_str += str[i];
        if (i + 1 != str.length)
            new_str += "/";
    }
    window.location.pathname = new_str;
}
