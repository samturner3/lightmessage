const axios = require('axios');
var moment = require('moment');

module.exports = (req, res) => {
  if (globalMode.static.weather.lastUpdated === null || Math.abs(globalMode.static.weather.lastUpdated - moment().unix() > 60)) {
    axios.get('http://api.openweathermap.org/data/2.5/weather', {
      params: {
        id: '6619279',
        units:'metric',
        APPID: '606dbbdf0ce7a40ed802ae863d9e65f4',
      }
    })
    .then(function (response) {
      // handle success
      console.log('Weather Data response', response.data);

      globalMode.static.weather.outSideTemp = parseFloat(response.data.main.temp.toFixed(1)) + '°C';
      globalMode.static.weather.outSideConditions = response.data.weather[0].main;
      globalMode.static.weather.outSideWeatherLocation = response.data.name;
      globalMode.static.weather.lastUpdated = moment().unix();
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
  } else {
    console.log('no need to update outside temp.')
  }
};
