const { createLogger } = require('../utils')

const debug = createLogger('hitomi/decodeIndex')

module.exports = buffer => {
  debug('resolving buffer:', buffer)

  const items = []
  const set = new DataView(buffer)
  const count = set.byteLength / 4

  debug('got set of items:', count)

  for (let i = 0; i < count; i++) {
    items.push(set.getInt32(i * 4, false /* big endian */))
  }

  return items
}
