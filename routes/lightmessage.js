var express = require('express')
var router = express.Router()

router.post('/', function (req, res, next) {
  console.log('light up!' + JSON.stringify(req.body))
  globalMode.messages.message = req.body.message;
  globalMode.messages.newMessage = true;
  globalMode.messages.loop = req.body.loop;
  res.redirect('/')
})

module.exports = router
