var express = require('express')
var router = express.Router()
// const handelWeather = require('../signFunctions/updateStaticweather')
const handelClock = require('../signFunctions/clockTick')
const handelOff = require('../signFunctions/off')

router.post('/', function (req, res, next) {
  console.log('Mode Change!' + JSON.stringify(req.body))
  globalMode.mode = req.body.ModeChangeButton
  if (req.body.ModeChangeButton === 'Weather') {
    // handelWeather(req, res)
  }
  if (req.body.ModeChangeButton === 'Clock') {
    handelClock('h:mm a')
  }
  if (req.body.ModeChangeButton === 'Off') {
    handelOff()
  }
  res.redirect('/')
})

module.exports = router
