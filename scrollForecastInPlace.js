const moment = require('moment');
const scrollMessageInPlace = require('./scrollMessageInPlace');

module.exports = async () => {
  if (globalMode.tick.weather.forecast) {
    if (globalMode.static.weather.forecastLastScrolled === null || Math.abs(moment().unix() - globalMode.static.weather.forecastLastScrolled > 5)) {
      globalMode.static.weather.forecastLastScrolled = moment().unix();
      // Remove outside temp static 
      await scrollMessageInPlace(`Now: ${globalMode.static.weather.outSideConditions}`, 70, 12, 12, 10);
      console.log(' scroll forecast done');
    } else { console.log('no need to scroll forecast'); }
  }
};
