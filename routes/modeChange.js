const express = require('express');

const router = express.Router();
// const handelWeather = require('../signFunctions/updateStaticweather')
const handelOff = require('../signFunctions/off');

router.post('/', (req, res, next) => {
  console.log(`Mode Change!${JSON.stringify(req.body)}`);
  // globalMode.mode = req.body.ModeChangeButton;
  // if (req.body.ModeChangeButton === 'Weather') {
  //   // handelWeather(req, res)
  //   next();
  // }
  // if (req.body.ModeChangeButton === 'Clock') {
  //   globalMode.tick.clock = true;
  //   next();
  // }
  // if (req.body.ModeChangeButton === 'Off') {
  //   handelOff();
  //   next();
  // }
  res.redirect('/');
});

module.exports = router;
