function wypisz_najlepsze_wyniki() {
    let dl = Number(localStorage.getItem('dlugosc'));
    let tab : number[] = [];
    for(let i = 0; i < dl; i++){
        let value = localStorage.getItem("wynik" + i.toString()) as string;
        tab[i] = Number(value);
    }

    let sorted_tab : number[] = tab.sort((a, b) => a - b);

    let ile_wypisz = dl;
    if(ile_wypisz > 5) ile_wypisz = 5;

    let list = document.getElementById('grid-top_lista') as HTMLElement;
    for(let i = 0; i < ile_wypisz; i++) {
        let new_list_el = document.createElement('li');
        let czas = (sorted_tab[i] / 1000).toFixed(1);
        new_list_el.appendChild(document.createTextNode(czas + "s"));
        list.appendChild(new_list_el);
    }
}

wypisz_najlepsze_wyniki();

function reset_wynikow() {
    let dl = Number(localStorage.getItem('dlugosc'));
    localStorage.removeItem('dlugosc');
    for(let i = 0; i < dl; i++){
        localStorage.removeItem('wynik' + i.toString());
        localStorage.removeItem('staty' + i.toString());
    }

    window.location.reload();
}