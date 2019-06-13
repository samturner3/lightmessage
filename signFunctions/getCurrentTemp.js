const axios = require('axios')
// This is BOM data for sydney airport
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.get('http://reg.bom.gov.au/fwo/IDN60901/IDN60901.94767.json')
      console.log(response) // observations.data[0].apparent_t observations.data[0].air_temp
      resolve(response)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
