const ethUtils = require('../utils/ethUtils')
const path = require('path')
const administratorProvider = require('./addresses/AdministratorProvider.json')
const userProvider = require('./addresses/UserProvider.json')

exports.deploy = async (web3, poster) => {
    return ethUtils.deploy(
            web3,
            'Certificate',
            poster,
            '../build/contracts',
            './deployment/addresses',
            [
                administratorProvider.address,
                userProvider.address
            ]
    )   
}