var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var lightMessageRouter = require('./routes/lightmessage');
var modeChangeRouter = require('./routes/modeChange');
var brightnessChangeRouter = require('./routes/brightnessChange');

var app = express();

globalMode = {
  mode: 'off',
  brightness: 100,
};

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// var Matrix = require("easybotics-rpi-rgb-led-matrix");
// led = new Matrix(32, 32, 1, 4, 50, "adafruit-hat-pwm"); //this might be different for you

// const input = 'input'; //wherever you get the input from
// // const font  =  './5x8.bdf';
// const font  =  __dirname + '/repo/node-rpi-rgb-led-matrix/external/matrix/fonts/' + "5x8.bdf";

// console.log('font', font);
// // console.log('__dirname', __dirname);
// //should be a function that calculates the postition based on timestamp
// //and increments the x position

// // led.drawText(70, 20, 255, 255, 255, 'input', font);

// led.drawText(0, 0, 'index', font, 255, 255, 255); 

// led.drawText(0, 0, input, font, 255, 0, 255); led.update();
// led.fill(255, 50, 100);
// led.setPixel(0, 0, 0, 50, 255);
// led.update();

// led.drawCircle(36, 15, 20, 200, 0, 200);
// led.update();

// while (circlerad < 20) {
//   led.drawCircle(36, 15, circlerad, 200, 0, 200);
//   led.update();
//   circlerad++;
//   while (circlerad) {
//         led.setPixel(x, y, 0, 50, 255);
//         led.update();
//         x++;
//         console.log('x', x);
//       }
// }

// while (y < height) {
//   x=0;
//   console.log('y', y);
//   while (x < width) {
//     led.setPixel(x, y, 0, 50, 255);
//     led.update();
//     x++;
//     console.log('x', x);
//   }
//   y++;
// }



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
