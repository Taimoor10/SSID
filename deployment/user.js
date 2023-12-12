const ethUtils = require('../utils/ethUtils')
const path = require('path')
const administratorProvider = require('./addresses/AdministratorProvider.json')

exports.deploy = async (web3, poster) => {
    return ethUtils.deploy(
            web3,
            'User',
            poster,
            '../build/contracts',
            './deployment/addresses',
            [
                administratorProvider.address
            ])
}