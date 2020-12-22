const getIndexOf = require('./getIndexOf')

const mods = {
  getIndexOf
}

const init = async () => {
  await mods[process.argv.slice(2).join(' ')]()
}

init()
