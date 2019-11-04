const moment = require('moment');

module.exports = function clockUTCLoop() {
  setTimeout(async () => {
    // console.log('time updated')
    globalMode.tick.values.tickTimeUTC = moment().utc().format('HH:mm');
    if (globalMode.tick.UtcClock) {
      clockUTCLoop();
    } else globalMode.tick.values.tickTimeUTC = undefined;
  }, 1000);
};
