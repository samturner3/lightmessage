var moment = require('moment');

let format = 'h:mm a';

module.exports = () => {
    const font  =  __dirname + '/../fonts/' + "9x15.bdf";
        globalMode.led.drawText(0, 0, moment().format(format), font, 255, 0, 0); 
        // console.log('tick', moment().format(format));
};
