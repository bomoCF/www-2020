class meme {
    constructor(meme_info) {
        this.id = meme_info.id;
        this.name = meme_info.name;
        this._price = meme_info.price;
        this.url = meme_info.url;
    }

    get price() {
        return this._price;
    }
}

class meme_db {
    constructor(memes, db) {
        this._db = db;
        this._db.init.then(() => {
            Promise.all(memes.map(x =>
                        this._db.add_meme(x.name, x.price, x.url, x.id))
                );
        }).catch(err => console.log(err));
    }

    async best() {
        const rows = await this._db.get_best();
        return rows.map(x => new meme(x, this._db));
    }

    async get_history(id) {
        return await this._db.get_history_id(id);
    }

    async add_meme_price(id, user, price) {
        return await this._db.add_meme_price(id, user, price);
    }

    async get_id(id) {
        let ret = null;
        try {
            ret = await this._db.get_id(id);
            console.log('memes ' + ret);
            console.log(ret);
        } catch(error) {
            console.log('zle');
            console.log(error);
        }

        return ret;
    }
}

module.exports = meme_db;
