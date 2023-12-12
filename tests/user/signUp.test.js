const userContract = require('../../contracts/User')
const Web3 = require('web3')
const ethUtils = require('../../utils/ethUtils')
const state = require('../state.json')
const User = require('../../lib/User')
const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')
const gasEstimates = require('../gasEstimates.json')

test('User registers (randomly generated) new account', async () => {
    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    const user = new User(
        web3,
        nacl
    )

    let transaction = await userContract.signUp(
        web3,
        {
            'email': web3.utils.randomHex(32),
            'user': user.account.address,
            'boxPublicKey': user.id,
            'status': 1
        },
        {address: poster.address},
        gasEstimates.User.signUp
    )

    let receipt = await ethUtils.sendTransactionWithDecryptedAccount(
        web3,
        {account: poster},
        transaction,
        gasEstimates.User.signUp
    )
})

makeDefaultUser = async () => {
    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    const user = new User(
        web3,
        nacl,
        {
            'email': 'hassaan.rana@obcc.de'
        }
    )

    let transaction = await userContract.signUp(
        web3,
        {
            'email': user.hashed('email'),
            'user': user.account.address,
            'boxPublicKey': user.id,
            'status': 1
        },
        {address: poster.address},
        gasEstimates.User.signUp
    )
    
    let receipt = await ethUtils.sendTransactionWithDecryptedAccount(
        web3,
        {account: poster},
        transaction,
        gasEstimates.User.signUp
    ).catch(err => {console.err})
}

test('User registers new account with existing email address', async () => {

    await makeDefaultUser()

    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    const user = new User(
        web3,
        nacl,
        {
            'email': 'hassaan.rana@obcc.de'
        }
    )

    let transaction = await userContract.signUp(
        web3,
        {
            'email': user.hashed('email'),
            'user': user.account.address,
            'boxPublicKey': user.id,
            'status': 1
        },
        {address: poster.address},
        gasEstimates.User.signUp
    )

    await expect(
        ethUtils.sendTransactionWithDecryptedAccount(
            web3,
            {account: poster},
            transaction,
            gasEstimates.User.signUp
        )
    ).rejects.toThrow(Error)
})