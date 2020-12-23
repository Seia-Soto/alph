const cheerio = require('cheerio')
const fetch = require('node-fetch')
const { createLogger, getUserAgent, normalizeString } = require('../utils')

const debug = createLogger('hitomi/getMetadata')

module.exports = async (id, fetchAgent) => {
  debug('requesting gallery block:', id)

  const res = await fetch(`https://ltn.hitomi.la/galleryblock/${id}.html`, {
    headers: {
      'User-Agent': getUserAgent(),
      pragma: 'no-cache',
      dnt: 1
    },
    agent: fetchAgent
  })
  const text = await res.text()

  debug('parsing DOM')

  const $ = cheerio.load(text, {
    normalizeWhitespace: true,
    decodeEntities: true,
    lowerCaseTags: true,
    lowerCaseAttributeNames: true
  })

  const title = $('h1.lillie > a').text()
  const artists = $('div.artist-list > ul')
    .toArray()
    .map(artist => normalizeString($(artist).text()))
  const contexts = $('table.dj-desc > tbody > tr') // NOTE: cheerio creates 'tbody' tag automatically;
    .toArray()
    .map(context => {
      const keyEl = $(context).find('td').first()
      const valuesEl = $(context).find('td').after(keyEl)

      const prop = {
        key: normalizeString(keyEl.text()),
        values: []
      }

      // NOTE: find multiple values if possible;
      const multipleValues = $(valuesEl)
        .find('ul > li')
        .toArray()
        .map(values => normalizeString($(values).text()))

      if (multipleValues.length > 0) {
        prop.values = multipleValues
      } else {
        prop.values.push(normalizeString($(valuesEl).find('a').text()))
      }

      return prop
    })
  const date = $('p.dj-date.date').text()

  return {
    title,
    artists,
    contexts,
    date
  }
}
