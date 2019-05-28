const axios = require('axios');

module.exports.handelWeather = () => {
    axios.get('http://reg.bom.gov.au/fwo/IDN60901/IDN60901.94767.json')
    .then(function (response) {
      // handle success
      console.log(response);
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
    .finally(function () {
      // always executed
    });
};
