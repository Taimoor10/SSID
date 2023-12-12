const ethUtils = require('../utils/ethUtils')
const path = require('path')

exports.deploy = async (web3, poster) => {
    return ethUtils.deploy(
            web3,
            'Administrator',
            poster,
            '../build/contracts',
            './deployment/addresses',
            false)
}