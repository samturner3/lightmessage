var Matrix = require("easybotics-rpi-rgb-led-matrix");

module.exports = () => {
    led = new Matrix(32, 32, 1, 4, globalMode.brightness, "adafruit-hat-pwm"); //this might be different for you
};