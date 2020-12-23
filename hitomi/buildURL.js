const { createLogger } = require('../utils')
const getIndexVersion = require('./getIndexVersion')

const debug = createLogger('hitomi/buildURL')

module.exports = async (opts = {}) => {
  const {
    key,
    value
  } = opts

  let url = 'https://ltn.hitomi.la'

  if (key) {
    debug('requesting assets as compressed')

    url += '/n'

    switch (key) {
      case 'language':
        url += `/index-${value}`
        break
      case 'female':
      case 'male':
        url += `/tag/${key}-${value}-all`
        break
      default:
        url += `/${key}/${value}-all`
    }

    url += '.nozomi' // NOTE: attach `nozomi` extension;
  } else {
    // WARN: unsupported feature;
    // NOTE: search as text (without tags);
    const idxVersion = await getIndexVersion('galleriesindex')

    url += `/galleriesindex/galleries.${idxVersion}.index`
  }

  return url
}
