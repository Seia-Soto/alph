const fetch = require('node-fetch')
const { createLogger, getUserAgent } = require('../utils')
const buildURL = require('./buildURL')
const decodeIndex = require('./decodeIndex')
const decodeNozomi = require('./decodeNozomi')

const debug = createLogger('hitomi/getIndexOf')

const decoders = {
  index: decodeIndex,
  nozomi: decodeNozomi
}

module.exports = async (opts = {}, fetchAgent) => {
  const {
    key,
    value,
    skip = 1,
    limit,
    decoder = 'nozomi'
  } = opts

  if (!key || !value) return [] // NOTE: remove `!opts.key` when plain-text search implemented;

  opts.key = opts.key.toLowerCase()
  opts.value = opts.value.toLowerCase()

  if (!opts.url) {
    opts.url = await buildURL({ key, value })
    opts.decoder = opts.url.split('.').slice(-1)[0]
  }

  const headers = {
    'User-Agent': getUserAgent(),
    'accept-encoding': 'identity', // NOTE: no compression of data;
    origin: 'https://hitomi.la',
    referer: 'https://hitomi.la/search.html?' + key + ':' + value,
    pragma: 'no-cache',
    dnt: 1
  }

  if (opts.limit && opts.limit > 0) {
    debug('limiting max items via `range` header')

    const bytesStart = (skip - 1) * limit * 4
    const bytesEnd = bytesStart + limit * 4 - 1

    headers.range = `bytes=${bytesStart}-${bytesEnd}`

    debug('calculated bytes range:', headers.range)
  }

  debug('requesting url:', opts.url)

  const res = await fetch(opts.url, {
    headers,
    agent: fetchAgent
  })
  const buffer = await res.arrayBuffer()

  return decoders[decoder](buffer)
}
