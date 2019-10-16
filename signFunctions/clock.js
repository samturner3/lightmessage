var moment = require('moment');

module.exports = (format) => {
    const font  =  __dirname + '/../fonts/' + "9x15.bdf";
    clockTicking = setInterval(function(){
        globalMode.led.clear();
        globalMode.led.drawText(0, 0, moment().format(format), font, 255, 0, 0); 
        globalMode.led.update();
        console.log('tick', moment().format(format));
      }, 1000)
};
