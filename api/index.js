const fetch = require('../lib/request')

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

module.exports = async (req, res) => {
  const { url, ...reqParams } = req.query
  if (!url) {
    return res.end('In order to use this proxy just append your desired url after the root `/`, feel free to use any method and headers.')
  }

  const sanitizedHeaders = sanitizeHeaders(req.headers || {})

  const reqParamsUrl = Object.keys(reqParams)
    .map(paramKey => `${paramKey}=${reqParams[paramKey]}`)
    .join('&')

  const urlWithSlashes = url
    .replace('https://', 'https:/')
    .replace('https:/', 'https://')
    .replace('http://', 'http:/')
    .replace('http:/', 'http://')

  if (urlWithSlashes.includes('.ico')) {
    return res.send('OK')
  }

  const finalUrl = `${urlWithSlashes}?${reqParamsUrl}`
  
  const options = {
    url: finalUrl,
    method: req.method,
    headers: sanitizedHeaders
  }

  if (req.body) {
    if (req.body.length) {
      options.body = req.body.replace(/\n/g, '')
    } else if (Object.keys(req.body).length) {
      options.body = JSON.stringify(req.body)
    }
  }

  console.log('Request made to:', finalUrl)

  return fetch(finalUrl, options)
    .then(async ({ response, body }) => {
      if (response && response.headers && response.headers['content-type'].includes('json')) {
        return res.json(JSON.parse(body))
      }
      return res.send(body)
    })
    .catch(err => {
      console.log('err ->', err)
      return res.send(err.message)
    })

}