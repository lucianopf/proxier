const request = require('request')
const zlib = require('zlib')

module.exports = (url, data) => {
  return new Promise((resolve, reject) => {
    request(url, {...data, encoding: null}, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        reject(error || response.statusCode)
      }
      if(response.headers['content-encoding'] == 'gzip'){
        zlib.gunzip(body, (err, dezipped) => {
          resolve({
            response,
            body: dezipped.toString('utf8')
          })
        })
      } else {
        resolve({
          response,
          body
        })
      }
    })
  })
}