var express = require('express')
var router = express.Router()

router.get('/', function (req, res, next) {
  res.render('index', { global_mode: globalMode.mode })
})

module.exports = router
