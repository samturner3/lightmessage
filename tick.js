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
let scrollMessage = 'hello world'
let newMessage = true;

let clockWidth = 72
const widthSpacing = 10

const font1 = __dirname + '/fonts/' + '9x15.bdf'
const font2 = __dirname + '/fonts/' + '6x12.bdf'
const font3 = __dirname + '/fonts/' + '6x10.bdf'

const drawStaticMessages = function () {
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
}

const updateLoop = function () {
  setTimeout(async function () {
    globalMode.led.clear()

    if (globalMode.messages.message && globalMode.messages.newMessage) {
      await scrollAMessage(globalMode.messages.message, 10 ,globalMode.messages.loop);
      globalMode.messages.newMessage = false;
    }

    drawStaticMessages()

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

const scrollAMessage = async function (message, speed = 5, loops, y = 0, includeStaticMessages = true) {

  var startX = (32*4);
  var endX = Math.abs(message.length * 6) * -1;

  async function func1() {
    for (var i = 0; i < loops; i++) {
      console.log(`func1 waiting for func2 #${i + 1}`);
      await func2(); // await in loop until func2() completed 
      console.log(`Finished iteration ${i} for func1`);
    }
  }

  async function func2 () {
    console.log('Started func2');
    for (let x = startX; x > endX ; x--) {        
        // console.log('runn', x)
        globalMode.led.clear()
        globalMode.led.drawText(x, y, message, font2, 0, 255, 0)
        if (includeStaticMessages) {
          drawStaticMessages();
        }
        globalMode.led.update()
        await delay(speed);
    }
  }

  function delay(speed) {
    return new Promise(resolve => setTimeout(resolve, speed));
  }

  await func1()
  console.log('finished')
  

}

module.exports = async function () {
  clockLoop()
  updateTemp()
  updateLoop()
  // updateLux()
  // await scrollAMessage('hello world')
  // console.log('finished scrollAMessage')
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
