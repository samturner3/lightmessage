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
      globalMode.tick.values.tickDate = [moment().format('dddd'), moment().format('Do MMMM')];
    }
    if (!globalMode.tick.date) globalMode.tick.values.tickDate = undefined;
    dateLoop();
  }, 1000);
};
