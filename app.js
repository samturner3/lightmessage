const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const Matrix = require('easybotics-rpi-rgb-led-matrix');

const indexRouter = require('./routes/index');
const lightMessageRouter = require('./routes/lightmessage');
const modeChangeRouter = require('./routes/modeChange');
const brightnessChangeRouter = require('./routes/brightnessChange');

const tick = require('./tick');

const app = express();

globalMode = {
  mode: 'off',
  brightness: 100,
  led: null,
  luxAuto: false,
  messages: {
    newMessage: false,
    message: null,
    loop: null,
  },
  busPIDMode: false,
  tick: {
    enabled: false,
    clock: true,
    UtcClock: true,
    temp: true,
    weather: {
      temp: true,
      conditions: false,
    },
    lux: false,
    values: {
      tickTime: null,
      tickTimeUTC: null,
      tickTemp: null,
      tickLux: null,
    },
  },
  static: {
    weather: {
      error: true,
      lastUpdated: null,
      outSideTemp: null,
      outSideConditions: null,
      outSideWeatherLocation: null,
    },
    busPid: {
      error: true,
      lastUpdated: null,
      fetched: false,
    },
  },
};

globalMode.led = new Matrix(32, 32, 1, 4, globalMode.brightness, 'adafruit-hat-pwm'); // this might be different for you

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
