const fetch = require('node-fetch')
const { createLogger, getUserAgent } = require('../utils')

const debug = createLogger('hitomi/getIndexOf')

module.exports = async (opts = {}, fetchAgent) => {
  const {
    key,
    value,
    skip = 1,
    limit,
    isCompressed = true
  } = opts

  if (!opts.key || !opts.value) return []

  opts.key = opts.key.toLowerCase()
  opts.value = opts.value.toLowerCase()

  let url = 'https://ltn.hitomi.la'

  if (1 || isCompressed) { // NOTE: should be always true;
    debug('requesting assets as compressed')

    url += '/n'
  }

  if (key === 'language') {
    url += `/index-${value}`
  } else {
    url += `/${key}/${value}-all`
  }

  url += '.nozomi' // NOTE: attach `nozomi` extension;

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

  debug('requesting url:', url)

  const res = await fetch(url, {
    headers,
    agent: fetchAgent
  })
  const buffer = await res.arrayBuffer()

  debug('resolving response:', buffer)

  const items = []
  const set = new DataView(buffer)
  const count = set.byteLength / 4

  debug('got set of items:', count)

  for (let i = 0; i < count; i++) {
    items.push(set.getInt32(i * 4, false /* big endian */))
  }

  return items
}
