const ethUtils = require('../utils/ethUtils')
const path = require('path')
const user = require('./addresses/User.json')

exports.deploy = async (web3, poster) => {
    return ethUtils.deploy(
            web3,
            'UserProvider',
            poster,
            '../build/contracts',
            './deployment/addresses',
            [
                user.address
            ]
    )   
}