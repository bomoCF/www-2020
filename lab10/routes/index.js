const mostExpensive = [
    {
        'id': 10,
        'name': 'Gold',
        'price': 1000,
        'url': 'https://i.redd.it/h7rplf9jt8y21.png'
    },
    {
        'id': 9,
        'name': 'Platinum',
        'price': 1100,
        'url': 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg'
    },
    {
        'id': 8,
        'name': 'Elite',
        'price': 1200,
        'url': 'https://i.imgflip.com/30zz5g.jpg'
    }
]

var express = require('express');
var router = express.Router();
const csrf = require('csurf');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Hasher = require('../authority');
const my_db = require('../db');
const meme_db = require('../memes');
const csrfProtection = csrf({cookie: true});
const parseForm = bodyParser.urlencoded({extended: false});
const db = new my_db();
const memes = new meme_db(mostExpensive, db);
const hasher = new Hasher();

function autorisation(req, res, next) {
    return req.isAuthenticated() ? next() : res.redirect('/login');
}

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    const user = await db.get_user_id(id);
    return done(null, user || false);
});

passport.use(new LocalStrategy(
    {usernameField: 'login', passwordField: 'pass'},
    function (username, password, done) {
        db.get_user_name(username).then(user => {
            if (!user)
                return done(null, false);
            hasher.compare(password, user.pass).then(good => {
                return done(null, good ? user : false);
            }).catch(err => {
                return done(err);
            })
        }).catch(err => {
            return done(err);
        });
    }));

router.use(function (req, res, next) {
    const get = Number(req.method === 'GET');
    if (req.session.views)
        req.session.views += get;
    else
        req.session.views = get;
    res.locals.views = req.session.views;
    next();
});

router.use(function (req, res, next) {
    res.locals.username = req.user ? req.user.login : null;
    next();
});

router.get('/register', csrfProtection, function (req, res) {
    return res.render('login', {
        title: 'Register',
        redirectRoute: '/register',
        csrfToken: req.csrfToken()
    });
});

router.post('/register', parseForm, csrfProtection, async function (req, res, next) {
    const username = req.body.login;
    const userExists = await db.get_user_name(username);
    if (userExists) return next(createError(422, 'Username busy'));

    try {
        const hash = await hasher.gen_hash(req.body.pass);
        await db.add_user(username, hash);
    } catch (err) {
        return next(createError(500, err));
    }
    return res.redirect('/login');
});

router.get('/login', csrfProtection, function (req, res) {
    return res.render('login', {
        title: 'Login',
        redirectRoute: '/login',
        csrfToken: req.csrfToken()
    });
});

router.post('/login', parseForm, csrfProtection,
    passport.authenticate(
        'local', {session: true, failureRedirect: '/login'}
    ),
    function (req, res) {
        return res.redirect('/');
    });

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/', async function (req, res) {
    const best = await memes.best();
    console.log(best);
    res.render('index', {
        title: 'Meme market',
        meme_map: best,
    });
});

router.get('/meme/:id', csrfProtection, async function (req, res) {
    const id = Number(req.params.id);
    // console.log('index' + id);
    const meme = await memes.get_id(id);
    // console.log('index' + meme);
    if (!meme) {
        res.status(404);
    }
    const history = await memes.get_history(id);

    res.render('meme', {meme: meme, price_history: history,
        csrfToken: req.csrfToken()});
});

router.post('/meme/:id', parseForm, csrfProtection,
    autorisation,
    async function (req, res) {
        // console.log("cos");
        if (req.body.price === '')
            return res.status(422);

        const id = Number(req.params.id);
        let meme = await memes.get_id(Number(req.params.id));
        
        if (!meme) {
            res.status(404);
        }
        const new_price = Number(req.body.price);
        await memes.add_meme_price(id, req.user.id, new_price);
        const new_history = await memes.get_history(id);

        res.render('meme', {meme: meme, price_history: new_history,
            csrfToken: req.csrfToken()});
    });

module.exports = router;