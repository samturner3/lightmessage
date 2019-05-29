var moment = require('moment');
const newLed = require('../newLed');

module.exports = () => {
    const font  =  __dirname + '/../repo/node-rpi-rgb-led-matrix/external/matrix/fonts/' + "9x15.bdf";
    globalMode.led.drawText(0, 0, moment().format('h:mm:ss a'), font, 255, 0, 0); 
    globalMode.led.update();
    clockTicking = setInterval(function(){
        globalMode.led.clear();
        globalMode.led.drawText(0, 0, moment().format('h:mm:ss a'), font, 255, 0, 0); 
        globalMode.led.update();
        console.log('tick', moment().format('h:mm:ss a'));
      }, 1000)
};