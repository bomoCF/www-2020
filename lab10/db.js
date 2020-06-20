const util = require('util');
const sqlite3 = require('sqlite3').verbose();
const {DB_PATH} = require('./config');

class my_db {
    constructor() {
        this.init = new Promise(((resolve, reject) => {
            this._db = new sqlite3.Database(DB_PATH, (err) => {
                this._run_promise('CREATE TABLE memes (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, url TEXT);')
                    .then(() => this._run_promise('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, login TEXT, pass TEXT);'))
                    .then(() => this._run_promise(`CREATE TABLE prices (id INTEGER PRIMARY KEY AUTOINCREMENT,
                                meme_id INTEGER NOT NULL, user_id INTEGER NOT NULL, price INTEGER NOT NULL,
                                FOREIGN KEY (meme_id) REFERENCES memes (id),
                                FOREIGN KEY (user_id) REFERENCES users (id));`))
                    .then(resolve).catch(reject);
            });
        }));
    }

    _fun_promise(fun) {
        return (str, param) =>
            util.promisify(fun).bind(this._db)(str, param);
    }

    _get_promise(str, param=[]) {
        return this._fun_promise(this._db.get)(str, param);
    }

    _run_promise(str, param=[]) {
        return this._fun_promise(this._db.run)(str, param);
    }

    _all_promise(str, param=[]) {
        return this._fun_promise(this._db.all)(str, param);
    }

    get_user_name(username) {
        const str = 'SELECT * FROM users WHERE login=?';
        return this._get_promise(str, [username]);
    }

    add_user(username, pass) {
        const str = 'INSERT INTO users (login, pass) VALUES (?, ?)'
        return this._run_promise(str, [username, pass]);
    }

    get_user_id(id) {
        const str = 'SELECT * FROM users WHERE id=?';
        return this._get_promise(str, [id]);
    }

    add_meme(name, price, url, id=null) {
        // console.log(name);
        // console.log(id);
        const memeInsert = `INSERT INTO memes (${id ? 'id,' : ''} name, url) VALUES
                       (${id ? '?, ' : ''} ?, ?);`;
        const priceInsert = `INSERT INTO prices (meme_id, user_id, price) VALUES
                            (?, ?, ?);`;

        const params = id ? [id, name, url] : [name, url];
        return this._run_promise(memeInsert, params).then(() =>
            this._run_promise(priceInsert, [id, 0, price])
        );
    }

    get_best() {
        const str = `SELECT memes.*, prices.price FROM memes JOIN prices ON memes.id = prices.meme_id
                      GROUP BY (prices.meme_id) HAVING prices.id = MAX(prices.id) ORDER BY prices.price DESC;`;

        console.log(this._db.all(str));
        return this._all_promise(str);
    }

    get_id(id) {
        console.log(this._db.get('SELECT id FROM memes'));
        const str = `SELECT memes.*, prices.price FROM memes JOIN prices ON memes.id = prices.meme_id
                      WHERE memes.id = ? GROUP BY (prices.meme_id) HAVING prices.id = MAX(prices.id);`;
                      console.log(this._db.get(str));
        return this._get_promise(str, [id]);
    }

    get_history_id(id) {
        const str = `SELECT price FROM prices WHERE meme_id = ? ORDER BY id DESC;`;
        return this._all_promise(str, [id]);
    }

    add_meme_price(id, user, price) {
        const str = `INSERT INTO prices (meme_id, user_id, price) VALUES (?, ?, ?);`;
        return this._run_promise(str, [id, user, price]);
    }
}


module.exports = my_db;