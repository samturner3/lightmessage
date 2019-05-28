var express = require('express');
var router = express.Router();

router.post('/', function(req, res, next) {
  console.log('light up!' + req.body.message);
  res.render('index', { last_message: req.body.message });
});

module.exports = router;
