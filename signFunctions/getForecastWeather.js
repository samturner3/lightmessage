// const axios = require('axios');
const moment = require('moment');

const PromiseFtp = require('promise-ftp');
const fs = require('fs');
const xml2js = require('xml2js');

const parser = new xml2js.Parser({ attrkey: 'ATTR' });

const grabForecastShortFromFTP = new Promise((resolve, reject) => {
  const ftp = new PromiseFtp();
  ftp.connect({ host: 'ftp.bom.gov.au' })
    .then(() => ftp.get('/anon/gen/fwo/IDN11060.xml'))
    .then((stream) => new Promise(((resolve1, reject1) => {
      stream.once('close', resolve1);
      stream.once('error', reject1, reject);
      stream.pipe(fs.createWriteStream('xml/shortForecast.xml'));
    })))
    .then(() => {
      ftp.end();
      resolve();
    });
});

const grabForecastShortFromFile = new Promise((resolve, reject) => {
  const xmlString = fs.readFileSync('xml/shortForecast.xml', 'utf8');
  parser.parseString(xmlString, async (error, result) => {
    if (error === null) {
      // check if needs to be updated

      const isExpired = (moment(result.product.amoc[0]['expiry-time'], moment.ISO_8601).isBefore(moment()));

      if (isExpired) {
        await grabForecastShortFromFTP;
        grabForecastShortFromFile();
      }

      resolve(result);
    } else {
      console.log(error);
      reject(error);
    }
  });
});

const grabForecastLongFromFTP = new Promise((resolve, reject) => {
  const ftp = new PromiseFtp();
  ftp.connect({ host: 'ftp.bom.gov.au' })
    .then(() => ftp.get('/anon/gen/fwo/IDN11050.xml'))
    .then((stream) => new Promise(((resolve1, reject1) => {
      stream.once('close', resolve1);
      stream.once('error', reject1, reject);
      stream.pipe(fs.createWriteStream('xml/longForecast.xml'));
    })))
    .then(() => {
      ftp.end();
      resolve();
    });
});

const grabForecastLongFromFile = new Promise((resolve, reject) => {
  const xmlString = fs.readFileSync('xml/longForecast.xml', 'utf8');
  parser.parseString(xmlString, async (error, result) => {
    if (error === null) {
      // check if needs to be updated

      const isExpired = (moment(result.product.amoc[0]['expiry-time'], moment.ISO_8601).isBefore(moment()));

      if (isExpired) {
        await grabForecastShortFromFTP;
        grabForecastLongFromFile();
      }
      resolve(result);
    } else {
      console.log(error);
      reject(error);
    }
  });
});


module.exports = async () => {
  if (globalMode.tick.weather.forecastShort === true || globalMode.tick.weather.forecastLong === true) {
    if (globalMode.static.weather.forecastShortLastUpdated === null || Math.abs(moment().unix() - globalMode.static.weather.forecastShortLastUpdated > 600)) {
      try {
        grabForecastShortFromFile.then((result) => {
          console.log('grabForecastShortFromFile ---->', result);
          console.log(result.product.forecast[0].area[2]['forecast-period'][0].text[0]._);
          globalMode.static.weather.forecastShort.text = result.product.forecast[0].area[2]['forecast-period'][0].text[0]._;
          globalMode.static.weather.forecastShort.probability = result.product.forecast[0].area[2]['forecast-period'][0].text[1]._;
          globalMode.static.weather.forecastShortLastUpdated = moment().unix();
        });
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File not found!');
          await grabForecastShortFromFTP;
          await grabForecastShortFromFile;
        } else {
          throw err;
        }
        // Here you get the error when the file was not found,
        // but you also get any other error
      }
    }
    if (globalMode.static.weather.forecastLongLastUpdated === null || Math.abs(moment().unix() - globalMode.static.weather.forecastLongLastUpdated > 600)) {
      try {
        await grabForecastLongFromFile.then((result) => {
          console.log('grabForecastLongFromFile --->');
          console.log(result.product.forecast[0].area[2]['forecast-period'][0].text[0]._);
          globalMode.static.weather.forecastLong = result.product.forecast[0].area[2]['forecast-period'][0].text[0]._;
          globalMode.static.weather.forecastLongLastUpdated = moment().unix();
        });
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.log('File not found!');
          await grabForecastLongFromFTP;
          const data = await grabForecastShortFromFile;
          console.log(data);
        } else {
          throw err;
        }
        // Here you get the error when the file was not found,
        // but you also get any other error
      }
    }
  }
};
