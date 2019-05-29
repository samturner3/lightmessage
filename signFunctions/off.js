var Matrix = require("easybotics-rpi-rgb-led-matrix");

module.exports = () => {
    clearInterval(clockTicking);
    console.log('globalMode.led', JSON.stringify(globalMode.led));
    globalMode.led.clear();
    globalMode.led.update();
};