const axios = require('axios');
var moment = require('moment');

module.exports = (req, res) => {
  if (globalMode.static.weather.lastUpdated === null || Math.abs(globalMode.static.weather.lastUpdated - moment().unix() > 600)) {
    axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        id: '6619279',
        units:'metric',
        APPID: '606dbbdf0ce7a40ed802ae863d9e65f4',
      }
    })
    .then(function (response) {
      // handle success
      // console.log(moment().format(), 'Weather Data response', response.data);
      console.log(moment().format(), 'Current weather updated', response.data.main.temp, ' °C');
      globalMode.static.weather.error = false;

      globalMode.static.weather.outSideTemp = Math.round(response.data.main.temp) + '°C';
      globalMode.static.weather.outSideConditions = response.data.weather[0].description;
      globalMode.static.weather.outSideWeatherLocation = response.data.name;
      // globalMode.static.weather.forcastTempTodayHigh = response.data.main.temp_min;
      // globalMode.static.weather.forcastTempTodayLow = response.data.main.temp_max;
      globalMode.static.weather.lastUpdated = moment().unix();
    })
    .catch(function (error) {
      // handle error
      console.log(moment().format(), error);
      globalMode.static.weather.error = true;
    })
    .finally(function () {
      // always executed
    });
  } else {
    // console.log('no need to update outside temp.')
  }
};
