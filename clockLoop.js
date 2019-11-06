const moment = require('moment');

module.exports = function clockLoop() {
  setTimeout(async () => {
    // console.log('time updated')
    globalMode.tick.values.tickTime = moment().format('h:mm:s a');
    if (globalMode.tick.clock) {
      clockLoop();
    } else globalMode.tick.values.tickTime = undefined;
  }, 1000);
};
