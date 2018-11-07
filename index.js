const express = require('express')
const fetch = require('./lib/request')
const app = express()

app.use('/favicon.ico', express.static('assets/favicon.ico'));

app.get('/', (req, res) => {
  res.send('In order to use this proxy just append your desired url after the root `/`, feel free to use any method and headers.')
})

app.use('/:url', (req, res) => {
  const reqUrl = req.originalUrl.split('').splice(1).join('')
  const options = {
    url: reqUrl,
    method: req.method,
    headers: req.headers
  }
  return fetch(reqUrl, options)
    .then(({ response, body}) => {
      res.send(body)
    })
    .catch(err => {
      res.send(err)
    })
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
