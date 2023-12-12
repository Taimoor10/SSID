const web3 = require('../config/web3')
const nacl = require('tweetnacl')
const Identity = require('./Identity')
nacl.util = require('tweetnacl-util')

module.exports = function () {
    return new Identity(web3, nacl)
}