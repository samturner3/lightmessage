var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  console.log('home', globalMode)
  res.render('index', { global_mode: globalMode.mode, global_brightness: globalMode.brightness, globalMode_luxAuto: globalMode.luxAuto })
})

module.exports = router
