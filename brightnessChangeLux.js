var express = require('express')
var router = express.Router()

module.exports = function (lux) {
  brightnessChange(lux)
}

const brightnessChange = function (lux) {
  // console.log('Brightness Change LUX!' + lux)

  if (lux > 2500) { globalMode.led.brightness(100) } else if (lux > 2000) globalMode.led.brightness(60)
  else if (lux > 1500) globalMode.led.brightness(100)
  else if (lux > 20) globalMode.led.brightness(90)
  else if (lux > 10) globalMode.led.brightness(50)
  else if (lux > 5) globalMode.led.brightness(40)
  else if (lux >= 1) globalMode.led.brightness(20)
  else if (lux == 0) globalMode.led.brightness(20)
  else {
    globalMode.led.brightness(100)
  }
}
