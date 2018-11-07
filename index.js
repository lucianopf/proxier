const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require('./lib/request')
const app = express()

function sanitizeHeaders(headers) {
  let sanitizedHeaders = {
    ...headers,
    origin: null,
    host: null,
    referer: null,
    connection: null,
    gzip: false,
    'content-length': null,
    'access-control-request-method': null,
    'access-control-request-headers': null,
  }
  return Object
    .keys(sanitizedHeaders)
    .reduce((result, headerKey) => {
      if (sanitizedHeaders[headerKey]) {
        result[headerKey] = sanitizedHeaders[headerKey]
      }
      return result
    }, {})
}

app.use(cors())
app.use(bodyParser.text({type: '*/*'}))
app.use('/favicon.ico', express.static('assets/favicon.ico'))

app.get('/', (req, res) => {
  res.send('In order to use this proxy just append your desired url after the root `/`, feel free to use any method and headers.')
})

app.use('/:url', (req, res) => {
  const reqUrl = req.originalUrl.split('').splice(1).join('')
  const sanitizedHeaders = sanitizeHeaders(req.headers)
  const options = {
    url: reqUrl,
    method: req.method,
    headers: sanitizedHeaders
  }

  if (req.body.length) {
    options.body = req.body.replace(/\n/g, '')
  } else if (Object.keys(req.body).length) {
    options.body = JSON.stringify(req.body)
  }

  console.log('Request made to:', reqUrl)
  return fetch(reqUrl, options)
    .then(({ response, body }) => {
      res.header('content-type', response.headers['content-type'])
      res.send(body)
    })
    .catch(err => {
      res.send(err)
    })
})

app.listen(3000, () => true)
