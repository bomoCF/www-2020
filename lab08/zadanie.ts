import {createServer, ServerResponse} from 'http';
import * as fs from 'fs';
import {promisify} from 'util';
import * as sqlite3 from 'sqlite3';

let read = promisify(fs.readFile);
// zalozBaze();

let server = createServer(
    (req, res) => {
        if(req.url == "/statystyki") {
            query_db_stats(res);
            // console.log("cos");
        } else {
            if(!is_valid_url(req.url)) res.statusCode = 500;
            query_db_file(req.url, res);
        }

        // res.end();
    }
);

server.listen(8080);

function is_valid_url(name : string) : boolean {
    if(name.length < 2) return false;
    if(name.split('/').length != 2) return false;
    return true;
}

async function query_db_file(name : string, res) {
    let ret = await read_file(name);
    res.write(ret);
    res.end();
}

async function query_db_stats(res) {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    // let db_all = promisify(db.all);

    db.all('SELECT sciezka, liczba FROM wyswietlenia;', [], (err, rows) => {
        if (err) throw(err);
        db.close();
        for(let {sciezka, liczba} of rows) {
            let ret = sciezka + '->' + liczba + "\n";
            console.log(ret);
            // ret.push(sciezka + "->" + liczba + "\n");
            // console.log(ret);
            res.write(ret);
        }
    });

    // let cos = await db_all('SELECT sciezka, liczba FROM wyswietlenia;');
    // console.log(cos);
    //  (err, rows) => {
    //     if (err) throw(err);
    //     db.close();
    //     for(let {sciezka, liczba} of rows) {
    //         let ret = sciezka + '->' + liczba + "\n";
    //         console.log(ret);
    //         // ret.push(sciezka + "->" + liczba + "\n");
    //         // console.log(ret);
    //         res.write(ret);
    //     }
    // });

    res.end();
}

// czytaj z pliku
async function read_file(name : string) : Promise<string> {
    let ret = "";
    name = "pliki" + name;
    try {
        ret = await read(name, "utf-8");
    } catch(e) {

    }
    return ret;
}

function zalozBaze() {
    sqlite3.verbose();
    let db = new sqlite3.Database('baza.db');
    db.run('CREATE TABLE wyswietlenia (sciezka VARCHAR(255), liczba INT);');
    db.close();
}