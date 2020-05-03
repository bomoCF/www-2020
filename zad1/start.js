"use strict";
function wypisz_najlepsze_wyniki() {
    var dl = Number(localStorage.getItem('dlugosc'));
    var tab = [];
    for (var i = 0; i < dl; i++) {
        var value = localStorage.getItem("wynik" + i.toString());
        tab[i] = Number(value);
    }
    var sorted_tab = tab.sort(function (a, b) { return a - b; });
    var ile_wypisz = dl;
    if (ile_wypisz > 5)
        ile_wypisz = 5;
    var list = document.getElementById('grid-top_lista');
    for (var i = 0; i < ile_wypisz; i++) {
        var new_list_el = document.createElement('li');
        var czas = (sorted_tab[i] / 1000).toFixed(1);
        new_list_el.appendChild(document.createTextNode(czas + "s"));
        list.appendChild(new_list_el);
    }
}
wypisz_najlepsze_wyniki();
function reset_wynikow() {
    var dl = Number(localStorage.getItem('dlugosc'));
    localStorage.removeItem('dlugosc');
    for (var i = 0; i < dl; i++) {
        localStorage.removeItem('wynik' + i.toString());
        localStorage.removeItem('staty' + i.toString());
    }
    window.location.pathname = window.location.pathname;
}
