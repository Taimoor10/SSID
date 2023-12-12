const Web3 = require('web3')
const fs = require('fs')
const state = require('./tests/state.json')
let web3 = new Web3('http://localhost:8545')

async function deploy(posterKey) {

    let decryptedAccount = web3.eth.accounts.privateKeyToAccount(posterKey)

    console.log('Deploying Administrator...')

    const administratorDeployer = require('./deployment/administrator')


    let receipt = await administratorDeployer.deploy(
        web3,
        {
            address: decryptedAccount.address,
            account: decryptedAccount
        }
    )

    console.log('Administrator:', receipt)

    console.log('Deploying AdministratorProvider')

    const administratorProviderDeployer = require('./deployment/administratorProvider')

    receipt = await administratorProviderDeployer.deploy(
        web3,
        {
            address: decryptedAccount.address,
            account: decryptedAccount
        }
    )

    console.log('AdministratorProvider:', receipt)

    console.log('Deploying User...')

    const userDeployer = require('./deployment/user')

    receipt = await userDeployer.deploy(
        web3,
        {
            address: decryptedAccount.address,
            account: decryptedAccount
        }
    )

    console.log('User:', receipt)

    console.log('Deploying UserProvider...');

    const userProviderDeployer = require('./deployment/userProvider')

    receipt = await userProviderDeployer.deploy(
        web3,
        {
            address: decryptedAccount.address,
            account: decryptedAccount
        }
    )

    console.log('UserProvider:', receipt)

    console.log('Deploying Certificate...')

    const certificateDeployer = require('./deployment/certificate')

    receipt = await certificateDeployer.deploy(
        web3,
        {
            address: decryptedAccount.address,
            account: decryptedAccount
        }
    )

    console.log('Certificate:', receipt)
}

deploy(state.administrators[0].privateKey)
