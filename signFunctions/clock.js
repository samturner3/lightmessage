var moment = require('moment');

var Matrix = require("easybotics-rpi-rgb-led-matrix");
led = new Matrix(32, 32, 1, 4, 50, "adafruit-hat-pwm"); //this might be different for you
const font  =  __dirname + '/repo/node-rpi-rgb-led-matrix/external/matrix/fonts/' + "5x8.bdf";

module.exports = () => {
    setInterval(function(){
        led.clear();
        led.drawText(0, 0, moment().format('h:mm:ss a'), font, 255, 0, 0); 
        led.update();
        console.log('tick', moment().format('h:mm:ss a'));
      }, 1000)
};