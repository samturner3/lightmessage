// Run something every second
const Mcp9808 = require('mcp9808-temperature-sensor')
var moment = require('moment')

const async = require('async')
const i2c = require('i2c-bus')

const brightnessChangeLux = require('./brightnessChangeLux')

const LUX_ADDR = 0x10

// const tickClock = require('./signFunctions/clockTick');
// const tickTemp = require('./signFunctions/tempTick');

// module.exports = require('./signFunctions/tempTick').then(function(){
//     console.log('tick');
// });
let tickTime
let tickTemp
let tickLux

let clockWidth = 72
const widthSpacing = 10

const font1 = __dirname + '/fonts/' + '9x15.bdf'
const font2 = __dirname + '/fonts/' + '6x12.bdf'
const font3 = __dirname + '/fonts/' + '6x10.bdf'

const updateLoop = function () {
  setTimeout(async function () {
    globalMode.led.clear()

    if (globalMode.luxAuto){
      brightnessChangeLux(tickLux)
    }

    if (tickTime) globalMode.led.drawText(0, 0, tickTime, font1, 255, 0, 0)
    else clockWidth = 0
    if (tickTemp) globalMode.led.drawText((clockWidth + (tickTime ? widthSpacing : 0)), 2, tickTemp, font2, 0, 255, 255)
    if (globalMode.tick.lux) {
      if (tickLux) {
        globalMode.led.drawText(0, 10, tickLux.toString(), font2, 0, 255, 0)
      } else {
        globalMode.led.drawText(0, 10, 'no lux data', font2, 0, 255, 0)
      }
    }
    globalMode.led.update()
    if (globalMode.tick.enabled) {
      updateLoop()
    }
  }, 1000)
}

const clockLoop = function () {
  setTimeout(async function () {
    // console.log('time updated')
    tickTime = moment().format('h:mm a')
    if (globalMode.tick.clock) {
      clockLoop()
    } else tickTime = undefined
  }, 1000)
}
const updateTemp = async function () {
  let sensor = await Mcp9808.open({ i2cBusNumber: 1, i2cAddress: 0x18 })
  let temp = await sensor.temperature()
  console.log('temp updated', temp.celsius + '°C')
  tickTemp = parseFloat(temp.celsius.toFixed(1)) + '°C'
  setTimeout(function () {
    if (globalMode.tick.temp) {
      updateTemp()
    } else tickTemp = undefined
  }, 60000)
}

const updateLux = async function () {
  let i2c1

  async.series([
    (cb) => i2c1 = i2c.open(1, cb),

    // Display temperature
    (cb) => {
      i2c1.readWord(LUX_ADDR, 0x04, (err, rawLight) => {
        if (err) return cb(err)
        //   console.log('rawLight: ' + rawLight);
        console.log('lux updated', rawLight)
        tickLux = rawLight
        cb(null)
      })
    },

    (cb) => i2c1.close(cb)
  ], (err) => {
    if (err) throw err
  })

  setTimeout(function () {
    updateLux()
  }, 1000)
}

module.exports = async function () {
  clockLoop()
  updateTemp()
  updateLoop()
  // updateLux()
}
// module.exports = async function(){
//     let temp = await require('./signFunctions/tempTick');
//     while (true) {
//         setInterval(() => {
//             console.log(temp.celsius);
//             console.log('tick');
//         }, 1000)
//     }
// };

// (function myLoop () {
//     setTimeout(function () {
//        alert('hello');          //  your code here
//        if (true) myLoop();      //  decrement i and call myLoop again if i > 0
//     }, 1000)
//  })();

// async function tick() {
//     // globalMode.led.clear(); // Clear
//     // Do buffer writes
//     // if (globalMode.tick.clock) tickClock();
//     await temp;
//     // Push to sign
//     // globalMode.led.update();
//     console.log('tick');
//   }

// const temp = new Promise((resolve, reject) => {
//     setTimeout(() => {
//     console.log('done');
//     resolve("done!")
//   }, 1000)
// });
