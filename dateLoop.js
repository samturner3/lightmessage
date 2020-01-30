const moment = require('moment');

module.exports = function dateLoop() {
  setTimeout(async () => {
    // console.log('time updated')
    if (globalMode.tick.dateBottom) {
      if (moment().format('dddd').length > 6) {
        globalMode.tick.values.tickDate = moment().format('dddd Do MMM YY');
      } else {
        globalMode.tick.values.tickDate = moment().format('dddd Do MMM YYYY');
      }
    } else {
      globalMode.tick.values.tickDate = [moment().format('dddd'), moment().format('Do MMM YYYY')];
    }
    if (globalMode.tick.date) {
      dateLoop();
    } else globalMode.tick.values.tickDate = undefined;
  }, 1000);
};
