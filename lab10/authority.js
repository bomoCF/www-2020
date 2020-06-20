const passport = require('passport');
const bcrypt = require('bcrypt');

class Hasher {
    constructor() {
        this.salt = 1;
    }

    async gen_hash(password) {
        return await bcrypt.hash(password, this.salt);
    }

    async compare(password, hash_password) {
        return await bcrypt.compare(password, hash_password);
    }
}

module.exports = Hasher;