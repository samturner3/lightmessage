// Run something every second
// const moment = require('moment');
const scrollAMessage = require('./scrollAMessage');
const scrollMessageInPlace = require('./scrollMessageInPlace');
const busPID = require('./busPID');
const coinTickerDisplay = require('./coinTickerDisplay');
const drawStaticMessages = require('./drawStaticMessages');
const drawBuffer = require('./drawBuffer');


const clockLoop = require('./clockLoop');
const clockUTCLoop = require('./clockUTCLoop');
const dateLoop = require('./dateLoop');
const covidLoop = require('./covidCounter');
const coinLoop = require('./coinTicker');
// const updateTemp = require('./updateTemp');
const updateLux = require('./updateLux');
// const updateStaticWeather = require('./signFunctions/updateStaticweather');
// const getForecastWeather = require('./signFunctions/getForecastWeather');
// const scrollForecastInPlace = require('./scrollForecastInPlace');

const updateLoop = function updateLoop() { // Main loop function (modes)
  setTimeout(async () => {
    globalMode.led.clear();
    if (globalMode.messages.message && globalMode.messages.newMessage) { // Scroll Message
      for (let i = 0; i < globalMode.messages.loop; i++) {
        // drawStaticMessages();
        await scrollMessageInPlace(globalMode.messages.message, 0, 24, 40, 10, 1, true, true, 0, 255, 100);
        // await scrollAMessage(globalMode.messages.message, 10, 20, false);
        globalMode.buffer = [];
      }
      globalMode.messages.newMessage = false;
    } else if (globalMode.busPIDMode) { // Bus PID mode
      await busPID();
      // globalMode.busPIDMode = false;
    } else if (globalMode.coinLoop) {
      await coinTickerDisplay();
    } else {
      globalMode.led.clear();
      globalMode.buffer = [];
      drawStaticMessages();
      //   scrollForecastInPlace();
      drawBuffer();
      globalMode.led.update();
    }


    if (globalMode.tick.enabled) {
      updateLoop();
    }
  }, 1000);
};

module.exports = async function tick() {
  clockLoop();
  // clockUTCLoop();
  dateLoop();
  // covidLoop();
  //   updateTemp();
  updateLoop();
//   updateStaticWeather();
//   getForecastWeather();
  // updateLux();
};
