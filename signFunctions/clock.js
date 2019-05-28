var moment = require('moment');
var Matrix = require("easybotics-rpi-rgb-led-matrix");

const font  =  __dirname + '/../repo/node-rpi-rgb-led-matrix/external/matrix/fonts/' + "5x8.bdf";

console.log('font', font);


module.exports = () => {
    led = new Matrix(32, 32, 1, 4, globalMode.brightness, "adafruit-hat-pwm"); //this might be different for you
    led.fill(255, 50, 100);
    led.update();
    setInterval(function(){
        led.clear();
        led.drawText(0, 0, moment().format('h:mm:ss a'), font, 255, 0, 0); 
        led.update();
        console.log('tick', moment().format('h:mm:ss a'));
      }, 1000)
};