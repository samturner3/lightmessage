var express = require('express');
var router = express.Router();
const handelWeather = require('../signFunctions/weather');
const handelClock = require('../signFunctions/clock');
const handelOff = require('../signFunctions/off');

router.post('/', function(req, res, next) {
  console.log('Mode Change!' + JSON.stringify(req.body));
  globalMode.mode = req.body.ModeChangeButton;
  if (req.body.ModeChangeButton === 'Weather') {
    handelWeather();
  }
  if (req.body.ModeChangeButton === 'Clock') {
    handelClock();
  }
  if (req.body.ModeChangeButton === 'Off') {
    handelOff();
  }
  res.redirect('/');
});

module.exports = router;
