const getUint64 = require('../utils/getUint64')

module.exports = buffer => {
  const set = new DataView(buffer)
  let position = 0

  // NOTE: keys;
  // NOTE: get the length of index;
  const items = []
  const itemCount = set.getInt32(0, false /* big endian */)

  position += 4

  for (let i = 0; i < itemCount; i++) {
    const blockSize = set.getInt32(i, false /* big endian */)

    // NOTE: skip index block;
    position += 4

    if (blockSize && blockSize <= 32) {
      items.push(buffer.slice(position, position + blockSize))

      // NOTE: skip data blocks;
      position += blockSize
    }
  }

  // NOTE: data;
  const data = []
  const dataCount = set.getInt32(position, false /* big endian */)

  position += 4

  for (let i = 0; i < dataCount; i++) {
    const offset = getUint64(set, position, false /* big endian */)

    position += 8

    const blockSize = set.getInt32(position, false /* big endian */)

    position += 4

    data.push([
      offset,
      blockSize
    ])
  }

  // NOTE: subnode address;
  const subnodes = []
  const subnodeCount = 16 + 1

  for (let i = 0; i < subnodeCount; i++) {
    const address = getUint64(set, position, false /* big-endian */)

    position += 8

    subnodes.push(address)
  }

  return {
    items,
    data,
    subnodes
  }
}
