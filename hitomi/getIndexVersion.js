const fetch = require('node-fetch')
const { createLogger, getUserAgent } = require('../utils')

const debug = createLogger('hitomi/getIndexVersion')

module.exports = async (type, fetchAgent) => {
  const version = Date.now()

  debug('querying index version of:', type)

  const res = await fetch(`https://ltn.hitomi.la/${type}/version?_=${version}`, {
    headers: {
      'User-Agent': getUserAgent(),
      pragma: 'no-cache',
      dnt: 1
    },
    agent: fetchAgent
  })
  const text = await res.text()

  return text
}
