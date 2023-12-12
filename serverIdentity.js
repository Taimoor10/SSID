const serverIdentity = require('./config/serverIdentity.json')
const Identity = require('./lib/identity2')

module.exports = new Identity(serverIdentity.secretKey)