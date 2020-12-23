const crypto = require('crypto')

module.exports = term => new Uint8Array(
  crypto
    .createHash('sha256')
    .update(term)
    .digest('hex')
    .slice(0, 4)
)
