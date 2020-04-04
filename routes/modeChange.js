const express = require('express');

const router = express.Router();
// const handelWeather = require('../signFunctions/updateStaticweather')
const handelOff = require('../signFunctions/off');

router.post('/', (req, res, next) => {
  console.log(`Mode Change!${JSON.stringify(req.body)}`);
  // globalMode.mode = req.body.ModeChangeButton;
  if (req.body.busPIDMode) {
    if (req.body.busPIDMode === 'on') {
      globalMode.busPIDMode = true;
      globalMode.static.busPid.alertsLastScrolled = null;
      // globalMode.tick.clock = false;
      globalMode.led.clear();
      globalMode.buffer = [];
    }
  } else {
    globalMode.busPIDMode = false;
  }
  if (req.body.dateMode) {
    if (req.body.dateMode === 'on') {
      globalMode.tick.date = true;
    } else {
      globalMode.tick.date = false;
    }
  }

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
