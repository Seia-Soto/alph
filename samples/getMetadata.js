const { getMetadata, getIndexOf } = require('../hitomi')
const { createLogger } = require('../utils')

const debug = createLogger('samples/getMetadata')

module.exports = async () => {
  debug('loading latest from language:korean')

  const [id] = await getIndexOf({
    key: 'language',
    value: 'korean',
    limit: 1
  })

  debug('loading metadata of:', id)

  const metadata = await getMetadata(id)

  debug(metadata)
  debug(JSON.stringify(metadata))
}
