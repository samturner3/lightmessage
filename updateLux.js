const LUX_ADDR = 0x10;

const i2c = require('i2c-bus');

module.exports = async function updateLux() {

  const i2c1 = i2c.open(1, err => {
    if (err) console.log(err);

    i2c1.readWord(LUX_ADDR, 0x04, (err, rawData) => {
      if (err) console.log(err);

      globalMode.tick.values.tickLux = rawData;

      i2c1.close(err => {
        if (err) console.log(err);
      });
    });
  });

  setTimeout(() => {
    updateLux();
  }, 1000);
};
