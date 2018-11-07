const express = require('express')
const fetch = require('./lib/request')
const app = express()

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

app.use('/favicon.ico', express.static('assets/favicon.ico'))

app.get('/', (req, res) => {
  res.send('In order to use this proxy just append your desired url after the root `/`, feel free to use any method and headers.')
})

app.use('/:url', (req, res) => {
  const reqUrl = req.originalUrl.split('').splice(1).join('')
  console.log('Request made to: ', reqUrl)
  console.log('Headers', req.headers)
  const options = {
    url: reqUrl,
    method: req.method,
    headers: Object.assign({}, req.headers, { Origin: null, Referer: null })
  }
  return fetch(reqUrl, options)
    .then(({ response, body}) => {
      res.send(body)
    })
    .catch(err => {
      res.send(err)
    })
})

app.listen(3000, () => true)
