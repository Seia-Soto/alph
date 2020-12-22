const debug = require('debug')

const { name } = require('../package.json')

module.exports = domain => {
  if (domain) {
    return debug(name + ':' + domain)
  } else {
    return debug(name)
  }
}
