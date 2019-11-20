const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  // console.log('home', globalMode);
  res.render('index', {
    global_mode: JSON.stringify(globalMode, null, '\t'), global_mode_obj: globalMode, global_brightness: globalMode.brightness, globalMode_luxAuto: globalMode.luxAuto,
  });
});

module.exports = router;
