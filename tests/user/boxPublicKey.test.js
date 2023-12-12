const userContract = require('../../contracts/User')
const Web3 = require('web3')
const ethUtils = require('../../utils/ethUtils')
const state = require('../state.json')
const User = require('../../lib/User')
const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')
const gasEstimates = require('../gasEstimates.json')

test('EOA is a registered user', async () => {

    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    let boxPublicKey = await userContract.boxPublicKey(
        web3,
        {
            email: web3.utils.keccak256('hassaan.rana@obcc.de')
        },
        {address: poster.address}
    )

    boxPublicKey = web3.utils.numberToHex(boxPublicKey)

    expect(boxPublicKey).not.toBe('0x0')
})

test('EOA is not a registered user', async () => {

    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    let boxPublicKey = await userContract.boxPublicKey(
        web3,
        {
            email: web3.utils.keccak256('someemail@somedomain.de')
        },
        {address: poster.address}
    )

    boxPublicKey = web3.utils.numberToHex(boxPublicKey)

    expect(boxPublicKey).toBe('0x0')
})

