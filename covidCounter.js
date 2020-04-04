const moment = require('moment');

module.exports = function covidLoop() {
  setTimeout(async () => {
    // console.log('time updated'){
    const now = moment();
    const startDate = moment(moment('16-03-2020', 'DD-MM-YYYY'));
    globalMode.tick.values.tickCovidCounter = `Day ${now.diff(startDate, 'days') + 1} in COVID lockdown`;
    if (!globalMode.tick.covidCounter || globalMode.brightness === 1) globalMode.tick.values.tickCovidCounter = undefined;
    covidLoop();
  }, 1000);
};
