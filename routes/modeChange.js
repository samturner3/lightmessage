var express = require('express');
var router = express.Router();
const handelWeather = require('../signFunctions/weather');

router.post('/', function(req, res, next) {
  console.log('Mode Change!' + JSON.stringify(req.body));
  globalMode.mode = req.body.ModeChangeButton;
  if (req.body.ModeChangeButton === 'Weather') {
    handelWeather.handelWeather();
  }
  res.redirect('/');
});

module.exports = router;
