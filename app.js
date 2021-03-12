require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Matrix = require('easybotics-rpi-rgb-led-matrix');
// Mqtt
const mqtt = require('mqtt');

const indexRouter = require('./routes/index');
const lightMessageRouter = require('./routes/lightmessage');
const modeChangeRouter = require('./routes/modeChange');
const brightnessChangeRouter = require('./routes/brightnessChange');

const tick = require('./tick');

const topicsToSubscribeTo = [
  // `${process.env.MQTT_SIGN_ID}/brightness`,
  // `${process.env.MQTT_SIGN_ID}/busPIDMode`,
  `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}/set`,
  // `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}/state`,
];

const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER_IP}`, {
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD,
});

mqttClient.on('connect', () => {
  mqttClient.publish(
    `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}/config`,
    JSON.stringify({
      '~': `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}`,
      name: process.env.MQTT_SIGN_ID,
      unique_id: process.env.MQTT_SIGN_ID,
      cmd_t: '~/set',
      stat_t: '~/state',
      schema: 'json',
      brightness: true,
      // effect: true,
      // effect_command_topic: '~/set',
      // effect_list: ['normal', 'busPID'],
      // effect_state_topic: '~/state',
    }),
  );
  mqttClient.publish(
    `${process.env.MQTT_SIGN_ID}/status`,
    `${process.env.MQTT_SIGN_ID} connected`,
  );
  mqttClient.subscribe(topicsToSubscribeTo, (err) => {
    if (err) console.error(err);
    else {
      console.log('Connected to MQTT. Subscribed to ', topicsToSubscribeTo);
    }
  });
});

const app = express();

globalMode = {
  buffer: [],
  mode: 'off',
  brightness: 20,
  led: null,
  luxAuto: false,
  messages: {
    newMessage: false,
    message: null,
    loop: null,
  },
  busPIDMode: false,
  tick: {
    enabled: true,
    clock: true,
    UtcClock: false,
    date: true,
    dateBottom: false,
    covidCounter: true,
    temp: false,
    weather: {
      temp: false,
      conditions: false,
      forecast: false,
      forecastShort: false,
      forecastLong: false,
    },
    lux: false,
    values: {
      tickTime: null,
      tickTimeUTC: null,
      tickDate: null,
      tickTemp: null,
      tickLux: null,
      tickCovidCounter: null,
    },
  },
  static: {
    weather: {
      error: false,
      lastUpdated: null,
      forecastShortLastUpdated: null,
      forecastLongLastUpdated: null,
      forecastLastScrolled: null,
      outSideTemp: null,
      outSideConditions: null,
      outSideWeatherLocation: null,
      forecastLong: null,
      forecastShort: {
        text: null,
        probability: null,
      },
    },
    busPid: {
      error: true,
      lastUpdated: null,
      fetched: false,
      alertsLastScrolled: null,
      routeTimeDisplayChangedLast: null,
      displayMode: 'time',
    },
  },
};

globalMode.led = new Matrix(
  32,
  32,
  1,
  4,
  globalMode.brightness,
  'adafruit-hat-pwm',
); // this might be different for you

tick();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lightmessage', lightMessageRouter);
app.use('/modeChange', modeChangeRouter);
app.use('/brightnessChange', brightnessChangeRouter);
app.use('/brightnessChange', brightnessChangeRouter);

// MQTT Routes
mqttClient.on('message', (topic, message) => {
  const messageJson = JSON.parse(message);
  switch (topic.toString()) {
    // case `${process.env.MQTT_SIGN_ID}/brightness`:
    //   console.log('set brightness to', message.toString());
    //   globalMode.brightness = parseInt(message.toString(), 10);
    //   globalMode.led.brightness(globalMode.brightness);
    //   break;
    // case `${process.env.MQTT_SIGN_ID}/busPIDMode`:
    //   console.log('set busPIDMode to', message.toString());
    //   if (message.toString() === 'true') globalMode.busPIDMode = true;
    //   else if (message.toString() === 'false') globalMode.busPIDMode = false;
    //   break;
    case `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}/set`:
      console.log('messageJson: ', messageJson);
      if (messageJson.brightness) {
        globalMode.brightness = messageJson.brightness;
        globalMode.led.brightness(globalMode.brightness);
      }

      mqttClient.publish(
        `homeassistant/light/rpi-sign/${process.env.MQTT_SIGN_ID}/state`,
        JSON.stringify({
          state: 'ON',
          brightness: globalMode.brightness,
        }),
      );
      break;
    default:
      console.warn('unknown mqtt message topic:', topic.toString());
  }
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
