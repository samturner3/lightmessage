var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.send('i\'m here for you');
});

router.post('/', function (req, res, next) {
    console.log(req.query.message);
    res.end();
});

module.exports = router;
