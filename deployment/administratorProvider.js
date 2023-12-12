const ethUtils = require('../utils/ethUtils')
const path = require('path')
const administrator = require('./addresses/Administrator.json')

console.log(administrator.address)

exports.deploy = async (web3, poster) => {
    return ethUtils.deploy(
            web3,
            'AdministratorProvider',
            poster,
            '../build/contracts',
            './deployment/addresses',
            [
                administrator.address
            ]
    )   
}