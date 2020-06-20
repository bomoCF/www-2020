class meme {
    constructor(meme_info) {
        this.id = meme_info.id;
        this.name = meme_info.name;
        this._price = meme_info.price;
        this._price_history = [this.price];
        this.url = meme_info.url;
    }

    get price() {
        return this._price;
    }

    set price(prc) {
        this._price = prc;
        this._price_history.push(this._price);
    }

    get price_history() {
        var cos = this._price_history;
        cos.reverse();
        return cos;
    }
}

class meme_tab {
    constructor(memes) {
        this.memes = memes.map(x => new meme(x));
    }

    get best() {
        this.memes.sort((a, b) => b.price - a.price);
        return this.memes.slice(0, 3);
    }

    get_id(id) {
        return this.memes.filter(x => x.id === +id)[0];
    }
}

module.exports = meme_tab;
