const axios = require('axios')
var parseString = require('xml2js').parseString
// This is BOM data for sydney airport
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    let data
    try {
      const response = await axios({
        method: 'get',
        url: 'ftp://ftp.bom.gov.au/anon/gen/fwo/IDN11050.xml',
        responseType: 'text'
      })
      console.log(response) // xml text?
      parseString(response, function (err, result) {
        if (err) reject(err)
        console.dir(result)
        data = result
        console.dir(data)

        // Map data here and return needed string forecast
      })
      resolve(data)
    } catch (error) {
      console.error(error)
      reject(error)
    }
  })
}
