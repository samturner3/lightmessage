var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    console.log('home', globalMode);
    res.render('index', { global_mode: globalMode.mode, global_brightness: globalMode.brightness });
// });

// router.post('/', function (req, res, next) {
    // console.log(req.query.message);
    // if (process.env.DEV === 'false'){
        var Matrix = require("easybotics-rpi-rgb-led-matrix");
        led = new Matrix(64, 64, 1, 1, 100, "adafruit-hat-pwm"); //this might be different for you

        const input = "hello world!"; //wherever you get the input from
        const font  =  __dirname + '/fonts/' + "5x8.bdf";

        //should be a function that calculates the postition based on timestamp
        //and increments the x position
        var x = 0;
        var y = 0;
        const width = led.getWidth();

        led.drawText(x, y, 255, 255, 255, input, font);
        led.update();

        // led.fill(255, 50, 100);
        led.setPixel(0, 0, 0, 50, 255);
        led.update();

        while (x < width) {
            x++;
            led.setPixel(x, 0, 0, 50, 255);
            led.update();
          }

    // }
});

module.exports = router;
