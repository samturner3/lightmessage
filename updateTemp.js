const moment = require('moment');
const Mcp9808 = require('mcp9808-temperature-sensor');

module.exports = async function updateTemp() {
  const sensor = await Mcp9808.open({ i2cBusNumber: 1, i2cAddress: 0x18 });
  const temp = await sensor.temperature();
  console.log(moment().format(), 'inside temp updated', `${temp.celsius}°C`);
  globalMode.tick.values.tickTemp = `${Math.round( temp.celsius * 10) / 10}°C`;
  setTimeout(() => {
    if (globalMode.tick.temp) {
      updateTemp();
    } else globalMode.tick.values.tickTemp = undefined;
  }, 60000);
};
