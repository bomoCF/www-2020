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
var meme_map = require('../memes');
var router = express.Router();
var memes = new meme_map(mostExpensive);

router.get('/', function (req, res) {
    res.render('index', { meme_map: memes.best })
});

router.post('/meme/:id', function (req, res) {
    var meme = memes.get_id(req.params.id);
    meme.price = +req.body.price;
    res.render('meme', {meme: meme});
});

router.get('/meme/:id', function (req, res) {
    var meme = memes.get_id(req.params.id);
    res.render('meme', {meme: meme});
});

module.exports = router;
