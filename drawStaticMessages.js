const brightnessChangeLux = require('./brightnessChangeLux');
const updateStaticWeather = require('./signFunctions/updateStaticweather');
const BufferItem = require('./bufferItem');

const fonts = require('./fonts');

const screenWidth = 32 * 4;

module.exports = function drawStaticMessages() {
  // run update functions
  if (globalMode.luxAuto) {
    brightnessChangeLux(globalMode.tick.values.tickLux);
  }

  // Draw stuff
  if (globalMode.tick.values.tickTime) globalMode.buffer.push(new BufferItem(0, 0, globalMode.tick.values.tickTime, fonts.fontFiles[15], 255, 0, 0));
  if (globalMode.tick.values.tickTimeUTC) {
    globalMode.buffer.push(new BufferItem(0, 11, globalMode.tick.values.tickTimeUTC, fonts.fontFiles[5], 255, 0, 0));
    globalMode.buffer.push(new BufferItem((fonts.getFontDimentionsSpacing('x', 5, globalMode.tick.values.tickTimeUTC, 0.5)), 15, 'UTC', fonts.fontFiles[1], 100, 10, 255));
  }
  if (globalMode.tick.values.tickDate) {
    if (globalMode.tick.dateBottom) {
      globalMode.buffer.push(new BufferItem(0, 21, globalMode.tick.values.tickDate, fonts.fontFiles[5], 0, 0, 255));
    } else {
      // globalMode.buffer.push(new BufferItem(70, 0, 'Wednesday', fonts.fontFiles[1], 0, 50, 255));
      globalMode.buffer.push(new BufferItem(70, 0, globalMode.tick.values.tickDate[0], fonts.fontFiles[1], 0, 50, 255));
      globalMode.buffer.push(new BufferItem(70, 7, globalMode.tick.values.tickDate[1], fonts.fontFiles[0], 0, 50, 255));
    }
  }
  if (globalMode.tick.values.tickTemp && globalMode.tick.temp) {
    // globalMode.buffer.push(new BufferItem((screenWidth - (globalMode.tick.values.tickTemp.length * fonts.getFontDimentions(5).x) - (3 * fonts.getFontDimentions(1).x)), 4, 'in ', fonts.fontFiles[1], 100, 10, 255));
    globalMode.buffer.push(new BufferItem((screenWidth - (globalMode.tick.values.tickTemp.length * fonts.getFontDimentions(5).x)), 0, globalMode.tick.values.tickTemp, fonts.fontFiles[5], 0, 0, 255));
  }
  if (globalMode.tick.lux) {
    if (globalMode.tick.values.tickLux) {
      globalMode.buffer.push(new BufferItem(0, 10, globalMode.tick.values.tickLux.toString(), fonts.fontFiles[9], 0, 255, 0));
    } else {
      globalMode.buffer.push(new BufferItem(0, 10, 'no lux data', fonts.fontFiles[9], 0, 255, 0));
    }
  }
  if (globalMode.tick.weather.temp) {
    if (globalMode.static.weather.outSideTemp !== null) {
      globalMode.buffer.push(new BufferItem((screenWidth - (globalMode.static.weather.outSideTemp.length * fonts.getFontDimentions(5).x) - (4 * fonts.getFontDimentions(1).x)), 14, 'out ', fonts.fontFiles[1], 100, 10, 255, 'temp-out'));
      globalMode.buffer.push(new BufferItem((screenWidth - (globalMode.static.weather.outSideTemp.length * fonts.getFontDimentions(5).x)), 10, globalMode.static.weather.outSideTemp, fonts.fontFiles[5], 0, 0, 255, 'temp-out'));
    }
  }
  if (globalMode.tick.weather.conditions) {
    if (globalMode.static.weather.outSideConditions !== null) {
      globalMode.buffer.push(new BufferItem((screenWidth - (globalMode.static.weather.outSideConditions.length * fonts.getFontDimentions(5).x)), 20, globalMode.static.weather.outSideConditions, fonts.fontFiles[5], 0, 0, 255));
    }
  }
  // Draw errors
  if (globalMode.static.weather.error === true) {
    globalMode.led.setPixel((globalMode.led.getWidth() - 1), 12, 255, 0, 0);
  }
};
