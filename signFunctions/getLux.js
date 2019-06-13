const i2c = require('i2c-bus')
const async = require('async')
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    let i2c1
    async.series([
      (cb) => i2c1 = i2c.open(1, cb),

      // Get Lux
      (cb) => {
        i2c1.readWord(0x10, 0x04, (err, rawLight) => {
          if (err) return reject(err)
          resolve(rawLight)
          cb(null)
          i2c1.close()
        })
      }
    ], (err) => {
      if (err) return reject(err)
    })
  })
}
