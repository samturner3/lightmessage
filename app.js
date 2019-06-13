var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var Matrix = require('easybotics-rpi-rgb-led-matrix')

var indexRouter = require('./routes/index')
var lightMessageRouter = require('./routes/lightmessage')
var modeChangeRouter = require('./routes/modeChange')
var brightnessChangeRouter = require('./routes/brightnessChange')
// const handelClock = require('./signFunctions/clockTick');
// const readTemp = require('./signFunctions/tempTick');
const tick = require('./tick')
const lux = require('./lux')

var app = express()

let globalMode = {
  mode: 'off',
  initialBrightness: 20,
  led: null,
  tick: {
    enabled: true,
    clock: true,
    temp: true,
    lux: false
  }
}

globalMode.led = new Matrix(32, 32, 1, 4, globalMode.initialBrightness, 'adafruit-hat-pwm')

// handelClock('h:mm a');
tick()

// readTemp();

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/lightmessage', lightMessageRouter)
app.use('/modeChange', modeChangeRouter)
app.use('/brightnessChange', brightnessChangeRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
