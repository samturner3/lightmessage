
var moment = require('moment');
var wordClock = require("word-clock");

module.exports = (format) => {
    const font  =  __dirname + '/../fonts/' + "9x15.bdf";
    clockTicking = setInterval(function(){
        var tick = new wordClock();
        globalMode.led.clear();
        globalMode.led.drawText(0, 0, tick.getTime(), font, 255, 0, 0); 
        //globalMode.led.drawText(0, 0, moment().format(format), font, 255, 0, 0); 
        globalMode.led.update();
        // console.log('tick', moment().format(format));
        console.log('tick', tick.getTime());
      }, 1000)
};
