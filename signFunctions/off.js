var Matrix = require("easybotics-rpi-rgb-led-matrix");

module.exports = () => {
    clearInterval(clockTicking);
    led.clear();
    led.update();
    led = null;
};