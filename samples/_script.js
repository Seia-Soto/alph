const getIndexOf = require('./getIndexOf')
const getMetadata = require('./getMetadata')

const mods = {
  getIndexOf,
  getMetadata
}

const init = async () => {
  await mods[process.argv.slice(2).join(' ')]()
}

init()
