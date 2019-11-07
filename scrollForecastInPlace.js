const moment = require('moment');
const scrollMessageInPlace = require('./scrollMessageInPlace');

module.exports = async () => {
  if (globalMode.tick.weather.forecast) {
    if (globalMode.static.weather.forecastLastScrolled === null || Math.abs(moment().unix() - globalMode.static.weather.forecastLastScrolled > 120)) {
      globalMode.static.weather.forecastLastScrolled = moment().unix();
      // Remove outside temp static from buffer
      //   removeTargetBufferObj('temp-out');
      const orgWeatherTempSetting = globalMode.tick.weather.temp;
      globalMode.tick.weather.temp = false;
      await scrollMessageInPlace(`Now in ${globalMode.static.weather.outSideWeatherLocation}: ${globalMode.static.weather.outSideConditions} ${globalMode.static.weather.outSideTemp}. Today: ${globalMode.static.weather.forecastLong} ${globalMode.static.weather.forecastShort.text} rain probability: ${globalMode.static.weather.forecastShort.probability} `, 60, 12, 12, 10);
      globalMode.tick.weather.temp = orgWeatherTempSetting;
      console.log(' scroll forecast done');
    }
  }
};
