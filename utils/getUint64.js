const createLogger = require('./createLogger')

const debug = createLogger('getUint64')

module.exports = (dataview, byteOffset, littleEndian) => {
  // split 64-bit number into two 32-bit (4-byte) parts
  const left = dataview.getUint32(byteOffset, littleEndian)
  const right = dataview.getUint32(byteOffset + 4, littleEndian)

  // combine the two 32-bit values
  const combined = littleEndian ? left + 2 ** 32 * right : 2 ** 32 * left + right

  if (!Number.isSafeInteger(combined)) {
    debug(combined, 'exceeds MAX_SAFE_INTEGER. Precision may be lost')
  }

  return combined
}
