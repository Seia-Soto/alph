const fetch = require('node-fetch')
const { getUserAgent } = require('../utils')

module.exports = async (type, fetchAgent) => {
  const version = Date.now()

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
