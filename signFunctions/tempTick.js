const Mcp9808 = require('mcp9808-temperature-sensor');

let tempSensor;
const font  =  __dirname + '/../fonts/' + "9x15.bdf";

// async function getTemp() {
//   let sensor = await Mcp9808.open({i2cBusNumber: 1, i2cAddress: 0x18});
//   let temp = await sensor.temperature();
//   console.log(temp.celsius + '°C');
//   sensor.close();
// }

module.exports = new Promise(async function(resolve, reject){
  let sensor = await Mcp9808.open({i2cBusNumber: 1, i2cAddress: 0x18});
  let temp = await sensor.temperature();
  console.log(temp.celsius + '°C');
  sensor.close();
  resolve(temp);
});

// module.exports = new Promise(function(resolve, reject){
//   async.function(function(response) {
//       foo = "foobar"

//       resolve(foo);
//   });
// });