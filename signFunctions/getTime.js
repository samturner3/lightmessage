var moment = require('moment')

let format = 'h:mm a'

module.exports = () => {
  return moment().format(format)
}
