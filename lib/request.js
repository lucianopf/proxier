const request = require('request')

module.exports = (data) => {
  return new Promise((resolve, reject) => {
    request(data, (error, response, body) => {
      if (error || response.statusCode !== 200) { 
        reject(error || response.statusCode)
      }
      resolve({
        response,
        body
      })
    })
  })
}