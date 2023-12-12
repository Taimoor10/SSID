const administratorContract = require('../../contracts/Administrator')
const Web3 = require('web3')
const ethUtils = require('../../utils/ethUtils')
const state = require('../state.json')
const gasEstimates = require('../gasEstimates.json')

test('Administrator EOA can execute revoke', async () => {
    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    let account = state.accounts[0]

    let transaction = await administratorContract.revoke(
        web3,
        {address: account.address},
        {address: poster.address},
        gasEstimates.Administrator.revoke
    )
    let receipt = await ethUtils.sendTransactionWithDecryptedAccount(
        web3,
        {account: poster},
        transaction
    )

    let isAccountAdministrator = await administratorContract.isAdministrator(
        web3,
        {address: account.address},
        {address: poster.address}
    )
    
    expect(isAccountAdministrator).toBe(false)
})