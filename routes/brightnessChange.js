const express = require('express');

const router = express.Router();

router.post('/', (req, res, next) => {
  console.log(`Brightness Change!${JSON.stringify(req.body)}`);
  if (req.body.BrightnessChangeButton) {
    switch (req.body.BrightnessChangeButton) {
      case 'Max':
        globalMode.brightness = 100;
        break;
      case '++':
        globalMode.brightness <= 90 ? (globalMode.brightness += 10) : globalMode.brightness = 100;
        break;
      case '+':
        globalMode.brightness <= 99 && (globalMode.brightness += 1);
        break;
      case '-':
        globalMode.brightness > 0 && (globalMode.brightness -= 1);
        break;
      case '--':
        globalMode.brightness >= 10 ? (globalMode.brightness -= 10) : globalMode.brightness = 0;
        break;
      case 'Min':
        globalMode.brightness = 1;
        break;
      default:
        globalMode.brightness = 20;
    }
  } else if (req.body.BrightnessSlider) {
    globalMode.brightness = req.body.BrightnessSlider;
  }
  globalMode.led.brightness(globalMode.brightness);
  res.redirect('/');
});

module.exports = router;
