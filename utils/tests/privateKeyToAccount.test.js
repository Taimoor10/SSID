const {privateKeyToAccount} = require('../ethUtils')
const Web3 = require('web3')

test('Invalid Key', () => {
    let web3 = new Web3('http://localhost:8545')

    let privateKeyToAccountWrapper = () => {
        privateKeyToAccount(web3, '123')
    }

    expect(privateKeyToAccountWrapper).toThrow('InvalidKey')
})

test('Valid Key', () => {
    let web3 = new Web3('http://localhost:8545')

    let account = privateKeyToAccount(web3, '0x54ed2652ff85dba5ca7532c56ddf78cd940b4c907a0f6096709cce52f659a238')

    expect(account).toBeInstanceOf(Object)
})