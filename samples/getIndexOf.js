const { getIndexOf } = require('../hitomi')
const { createLogger } = require('../utils')

const debug = createLogger('samples/getIndexOf')

module.exports = async () => {
  debug('sampling request...', 'language:korean')

  const languageIndex = await getIndexOf({
    key: 'language',
    value: 'korean'
  })

  debug(languageIndex)

  debug('sampling request...', 'artist:hiten')

  const artistIndex = await getIndexOf({
    key: 'artist',
    value: 'hiten'
  })

  debug(artistIndex)
}
