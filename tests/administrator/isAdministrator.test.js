const administratorContract = require('../../contracts/Administrator')
const Web3 = require('web3')
const state = require('../state.json')

test('EOA is Administrator', async () => {
    let web3 = new Web3('http://localhost:8545')

    let account = state.administrators[1]

    let isAccountAdministrator = await administratorContract.isAdministrator(
        web3,
        {address: account.address},
        {address: account.address}
    )
    
    expect(isAccountAdministrator).toBe(true)
})

test('EOA is not Administrator', async() => {
    let web3 = new Web3('http://localhost:8545')

    let account = state.accounts[0]

    let isAccountAdministrator = await administratorContract.isAdministrator(
        web3,
        {address: account.address},
        {address: account.address}
    )

    expect(isAccountAdministrator).toBe(false)
})