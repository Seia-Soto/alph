const fetch = require('node-fetch')
const { createLogger, getUserAgent } = require('../utils')

const debug = createLogger('hitomi/getIndexOf')

module.exports = async (opts = {}, fetchAgent) => {
  const {
    key,
    value,
    page = 1,
    next = 25,
    isCompressed = true
  } = opts

  let url = 'https://ltn.hitomi.la'

  if (1 || isCompressed) { // NOTE: should be always true;
    debug('requesting assets as compressed')

    url += '/n'
  }

  const bytesStart = (page - 1) * next * 4
  const bytesEnd = bytesStart + next * 4 - 1

  debug('calculated bytes range:', `bytes=${bytesStart}-${bytesEnd}`)

  switch (key) {
    case 'artist':
      url += `/artist/${value}-all.nozomi`
      break
    case 'language':
      url += `/index-${value}.nozomi`
      break
    case 'tag':
      url += `/tag/${value}-all.nozomi`
      break
    default:
      url += '/'
  }

  debug('requesting url:', url)

  const res = await fetch(url, {
    headers: {
      'User-Agent': getUserAgent(),
      'accept-encoding': 'identity', // NOTE: no compression of data;
      range: `bytes=${bytesStart}-${bytesEnd}`,
      origin: 'https://hitomi.la',
      referer: 'https://hitomi.la/search.html?' + key + ':' + value,
      pragma: 'no-cache',
      dnt: 1
    },
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
