var express = require('express')
var router = express.Router()

module.exports = function (lux) {
  brightnessChange(lux)
}

const brightnessChange = function (lux) {
  console.log('Brightness Change LUX!' + lux)

  if (lux > 2500) { globalMode.led.brightness(100) } else if (lux > 2000) globalMode.led.brightness(60)
  else if (lux > 1500) globalMode.led.brightness(50)
  else if (lux > 1000) globalMode.led.brightness(30)
  else if (lux > 500) globalMode.led.brightness(20)
  else if (lux > 45) globalMode.led.brightness(10)
  else if (lux < 45) globalMode.led.brightness(1)
  else {
    globalMode.led.brightness(100)
  }
}
