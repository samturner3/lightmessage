var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log('light up!' + req.query.message);
  res.render('index', { last_message: req.query.message });
});

module.exports = router;
