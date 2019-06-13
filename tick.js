// Run something every second
var path = require('path')
const brightnessChangeLux = require('./brightnessChangeLux')

const getTemp = require('./signFunctions/getTemp')
const getTime = require('./signFunctions/getTime')
const getLux = require('./signFunctions/getLux')

let tickTime
let tickTemp

let clockWidth = 72
const widthSpacing = 10

const font1 = path.join(__dirname, '/fonts/', '9x15.bdf')
const font2 = path.join(__dirname, '/fonts/', '6x12.bdf')
// const font3 = path.join(__dirname, '/fonts/', '6x10.bdf')

const updateLoop = () => {
  setTimeout(() => {
    globalMode.led.clear()

    brightnessChangeLux(getLux()) // Update brightness every second

    if (tickTime) globalMode.led.drawText(0, 0, tickTime, font1, 255, 0, 0)
    else clockWidth = 0
    if (tickTemp) globalMode.led.drawText((clockWidth + (tickTime ? widthSpacing : 0)), 2, tickTemp, font2, 0, 255, 255)

    globalMode.led.update()
    if (globalMode.tick.enabled) {
      updateLoop()
    }
  }, 1000)
}

const updateTime = () => {
  setTimeout(() => {
    tickTime = getTime()
    if (globalMode.tick.clock) {
      updateTime()
    } else tickTime = undefined
  }, 1000)
}
const updateTemp = async () => {
  let temp = await getTemp()
  console.log('temp updated', temp.celsius + '°C')
  tickTemp = parseFloat(temp.celsius.toFixed(1)) + '°C'
  setTimeout(() => {
    if (globalMode.tick.temp) {
      updateTemp()
    } else tickTemp = undefined
  }, 60000)
}

module.exports = () => {
  updateTime()
  updateTemp()
  updateLoop()
}
