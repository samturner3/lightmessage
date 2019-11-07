// Run something every second
const scrollAMessage = require('./scrollAMessage');
const scrollMessageInPlace = require('./scrollMessageInPlace');
const busPID = require('./busPID');
const drawStaticMessages = require('./drawStaticMessages');
const drawBuffer = require('./drawBuffer');

const clockLoop = require('./clockLoop');
const clockUTCLoop = require('./clockUTCLoop');
const dateLoop = require('./dateLoop');
const updateTemp = require('./updateTemp');
const updateStaticWeather = require('./signFunctions/updateStaticweather');

const updateLoop = function updateLoop() { // Main loop function (modes)
  setTimeout(async () => {
    globalMode.led.clear();
    if (globalMode.messages.message && globalMode.messages.newMessage) { // Scroll Message
      for (let i = 0; i < globalMode.messages.loop; i++) {
        drawStaticMessages();
        await scrollMessageInPlace(globalMode.messages.message);
        globalMode.buffer = [];
      }
      globalMode.messages.newMessage = false;
    } else if (globalMode.busPIDMode) { // Bus PID mode
      await busPID();
      // globalMode.busPIDMode = false;
    } else {
      globalMode.led.clear();
      globalMode.buffer = [];
      drawStaticMessages();
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
  clockUTCLoop();
  dateLoop();
  updateTemp();
  updateLoop();
  updateStaticWeather();
  // updateLux()
};
