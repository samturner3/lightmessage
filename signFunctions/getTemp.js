const Mcp9808 = require('mcp9808-temperature-sensor')
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    let sensor = await Mcp9808.open({ i2cBusNumber: 1, i2cAddress: 0x18 })
    let temp = await sensor.temperature()
    console.log(temp.celsius + '°C')
    sensor.close()
    resolve(temp)
  })
}
