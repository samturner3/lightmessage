// Run something every second
const Mcp9808 = require('mcp9808-temperature-sensor')
var moment = require('moment')

const async = require('async')
const i2c = require('i2c-bus')

const brightnessChangeLux = require('./brightnessChangeLux')
const updateStaticWeather = require('./signFunctions/updateStaticweather')

const LUX_ADDR = 0x10

// const tickClock = require('./signFunctions/clockTick');
// const tickTemp = require('./signFunctions/tempTick');

// module.exports = require('./signFunctions/tempTick').then(function(){
//     console.log('tick');
// });
let tickTime
let tickTimeUTC
let tickTemp
let tickLux
let scrollMessage = 'hello world'
let newMessage = true;

const screenWidth = 32*4

let clockWidth = 7*6
const widthSpacing = 10

const fonts = [
__dirname + '/fonts/' + '4x6.bdf', //0
__dirname + '/fonts/' + '5x7.bdf', //1
__dirname + '/fonts/' + '5x8.bdf', //2
__dirname + '/fonts/' + '6x9.bdf', //3
__dirname + '/fonts/' + '6x10.bdf', //4
__dirname + '/fonts/' + '6x12.bdf', //5
__dirname + '/fonts/' + '6x13.bdf', //6
__dirname + '/fonts/' + '6x13B.bdf', //7
__dirname + '/fonts/' + '6x13O.bdf', //8
__dirname + '/fonts/' + '7x13.bdf', //9
__dirname + '/fonts/' + '7x13B.bdf', //10
__dirname + '/fonts/' + '7x13O.bdf', //11
__dirname + '/fonts/' + '7x14.bdf', //12
__dirname + '/fonts/' + '7x14B.bdf', //13
__dirname + '/fonts/' + '8x13.bdf', //14
__dirname + '/fonts/' + '8x13B.bdf', //15
__dirname + '/fonts/' + '8x13O.bdf', //16
__dirname + '/fonts/' + '9x15.bdf', //17
__dirname + '/fonts/' + '9x15B.bdf', //18
__dirname + '/fonts/' + '9x18.bdf', //19
__dirname + '/fonts/' + '9x18B.bdf', //20
__dirname + '/fonts/' + '10x20.bdf', //21
__dirname + '/fonts/' + 'cIR6x12.bdf', //22
__dirname + '/fonts/' + 'helvR12.bdf', //23
__dirname + '/fonts/' + 'tom-thumb.bdf', //24
]

const getFontDimentions = function(fontIndex) {
  const x = fonts[fontIndex].split('/fonts/')[1].split('x')[0].replace(/\D/g,'');
  const y = fonts[fontIndex].split('/fonts/')[1].split('x')[1].replace(/\D/g,'');
  // console.log('x:', x, ' y:',y)
  return({x,y})
}

const getFontDimentionsSpacing = function(pos, fontIndex, string, additonalSpace) {
  const x = fonts[fontIndex].split('/fonts/')[1].split('x')[0].replace(/\D/g,'');
  const y = fonts[fontIndex].split('/fonts/')[1].split('x')[1].replace(/\D/g,'');
  // console.log('x:', x, ' y:',y)

  if (pos === 'x')
    return(x * string.length + additonalSpace * x);
  if (pos ==='y')
    return(y * string.length + additonalSpace * y);
}

const drawStaticMessages = function () {
  // run update functions
  if (globalMode.luxAuto){
    brightnessChangeLux(tickLux)
  }
  if (globalMode.tick.weather.temp === true || globalMode.tick.weather.conditions === true) updateStaticWeather();

  // Draw stuff
  if (tickTime) globalMode.led.drawText(0, 0, tickTime, fonts[15], 255, 0, 0)
  else clockWidth = 0
  if (tickTimeUTC) {
    globalMode.led.drawText(0, 14, tickTimeUTC, fonts[5], 255, 0, 0)
    globalMode.led.drawText((getFontDimentionsSpacing('x',5,tickTimeUTC,0.5)), 19, 'UTC', fonts[1], 100, 10, 255)
  }
  if (tickTemp) {
    globalMode.led.drawText((screenWidth - (tickTemp.length * getFontDimentions(5).x) - (3 * getFontDimentions(1).x)), 4, 'in ', fonts[1], 100, 10, 255)
    globalMode.led.drawText((screenWidth - (tickTemp.length * getFontDimentions(5).x)), 0, tickTemp, fonts[5], 0, 0, 255)
  }
  if (globalMode.tick.lux) {
    if (tickLux) {
      globalMode.led.drawText(0, 10, tickLux.toString(), fonts[9], 0, 255, 0)
    } else {
      globalMode.led.drawText(0, 10, 'no lux data', fonts[9], 0, 255, 0)
    }
  }
  if (globalMode.tick.weather.temp) {
    if (globalMode.static.weather.outSideTemp !== null ) {
      globalMode.led.drawText((screenWidth - (globalMode.static.weather.outSideTemp.length * getFontDimentions(5).x) - (4 * getFontDimentions(1).x)), 14, 'out ', fonts[1], 100, 10, 255)
      globalMode.led.drawText((screenWidth - (globalMode.static.weather.outSideTemp.length * getFontDimentions(5).x)), 10, globalMode.static.weather.outSideTemp, fonts[5], 0, 0, 255)
    }
  }
  if (globalMode.tick.weather.conditions) {
    if (globalMode.static.weather.outSideConditions !== null) {
      globalMode.led.drawText((screenWidth - (globalMode.static.weather.outSideConditions.length * getFontDimentions(5).x)), 20, globalMode.static.weather.outSideConditions, fonts[5], 0, 0, 255)
    }
  }
  // Draw errors
  // if (globalMode.tick.weather.temp === true || globalMode.tick.weather.conditions === true) {
    if (globalMode.static.weather.error === true) {
      const x = 40;
      globalMode.led.setPixel((globalMode.led.getWidth() - 1), 12, 255, 0, 0);
    }
  // }
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
const clockUTCLoop = function () {
  setTimeout(async function () {
    // console.log('time updated')
    tickTimeUTC = moment().utc().format('HH:mm')
    if (globalMode.tick.UtcClock) {
      clockUTCLoop()
    } else tickTimeUTC = undefined
  }, 1000)
}
const updateTemp = async function () {
  let sensor = await Mcp9808.open({ i2cBusNumber: 1, i2cAddress: 0x18 })
  let temp = await sensor.temperature()
  console.log(moment().format(), 'inside temp updated', temp.celsius + '°C')
  tickTemp = Math.round(temp.celsius) + '°C'
  setTimeout(function () {
    if (globalMode.tick.temp) {
      updateTemp()
    } else tickTemp = undefined
  }, 600000)
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

const scrollAMessage = async function (message, speed = 5, loops, y = 12, includeStaticMessages = true) {

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
        globalMode.led.drawText(x, y, message, fonts[3], 0, 255, 0)
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
  clockUTCLoop()
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
