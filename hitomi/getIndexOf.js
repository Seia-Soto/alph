const fetch = require('node-fetch')
const { getUserAgent } = require('../utils')

module.exports = async (key, value, fetchAgent) => {
  let url = 'https://ltn.hitomi.la'

  switch (key) {
    case 'artist':
      url += `/n/artist/${value}-all.nozomi`
      break
    case 'language':
      url += `/n/index-${value}.nozomi`
      break
    case 'tag':
      url += `/n/tag/${value}-all.nozomi`
      break
    default:
      url += '/'
  }

  const res = await fetch(url, {
    headers: {
      'User-Agent': getUserAgent(),
      pragma: 'no-cache'
    },
    agent: fetchAgent
  })
  const text = await res.text()

  return text
}
