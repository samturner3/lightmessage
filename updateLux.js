const LUX_ADDR = 0x10;
const async = require('async');
const i2c = require('i2c-bus');

module.exports = async function updateLux() {
  let i2c1;

  async.series([
    (cb) => i2c1 = i2c.open(1, cb),

    // Display temperature
    (cb) => {
      i2c1.readWord(LUX_ADDR, 0x04, (err, rawLight) => {
        if (err) return cb(err);
        console.log(`rawLight: ${rawLight}`);
        console.log('lux updated', rawLight);
        globalMode.tick.values.tickLux = rawLight;
        cb(null);
      });
    },

    (cb) => i2c1.close(cb),
  ], (err) => {
    if (err) throw err;
  });

  setTimeout(() => {
    updateLux();
  }, 1000);
};
