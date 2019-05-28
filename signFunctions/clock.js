var moment = require('moment');
const newLed = require('../newLed');

module.exports = () => {
    if (!led) {
        newLed();
    }
    const font  =  __dirname + '/../repo/node-rpi-rgb-led-matrix/external/matrix/fonts/' + "5x8.bdf";
    led.fill(255, 50, 100);
    led.update();
    clockTicking = setInterval(function(){
        led.clear();
        led.drawText(0, 0, moment().format('h:mm:ss a'), font, 255, 0, 0); 
        led.update();
        console.log('tick', moment().format('h:mm:ss a'));
      }, 1000)
};