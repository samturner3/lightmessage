// Run something every second
const scrollAMessage = require('./scrollAMessage');
const drawStaticMessages = require('./drawStaticMessages');

const clockLoop = require('./clockLoop');
const clockUTCLoop = require('./clockUTCLoop');
const updateTemp = require('./updateTemp');

const updateLoop = function updateLoop() { // Main loop function (modes)
  setTimeout(async () => {
    globalMode.led.clear();

    if (globalMode.messages.message && globalMode.messages.newMessage) { // Scroll Message
      await scrollAMessage(globalMode.messages.message, 10, globalMode.messages.loop);
      globalMode.messages.newMessage = false;
    }

    // if (globalMode.busPIDMode) { // Bus PID mode
    //   await busPID(globalMode.messages.message, 10 ,globalMode.messages.loop);
    //   globalMode.messages.newMessage = false;
    // }

    drawStaticMessages();

    globalMode.led.update();

    if (globalMode.tick.enabled) {
      updateLoop();
    }
  }, 1000);
};

module.exports = async function tick() {
  clockLoop();
  clockUTCLoop();
  updateTemp();
  updateLoop();
  // updateLux()
};
