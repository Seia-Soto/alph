const { createLogger } = require('../utils')

const debug = createLogger('hitomi/decodeNozomi')

module.exports = buffer => {
  debug('unsupported feature, impl required: B_search')

  return buffer
}
