const ethUtils = require('../ethUtils')
const Web3 = require('web3')
const administratorContract = require('../../contracts/Administrator')
const state = require('../../tests/state.json')
const { GasTooLowError } = require('../../lib/errors')

makeRequests = async (gas) => {
    let web3 = new Web3('http://localhost:8545')

    let poster = web3.eth.accounts.privateKeyToAccount(
        state.administrators[0].privateKey
    )

    let account = state.administrators[1]

    let transaction = await administratorContract.grant(
        web3,
        {address: account.address},
        {address: poster.address},
        gas
    )

    return {
        transaction,
        poster
    }
}

test('Invalid Connection', async () => {
    let web3 = new Web3('http://localhost:6545')

    let { transaction, poster } = await makeRequests(50000)

    await expect(ethUtils.sendTransactionWithDecryptedAccount(
            web3,
            {account: poster}, 
            transaction
        )).rejects.toThrow('ConnectionError')
})

test('Gas Too Low Throws GasTooLow', async () => {
    let web3 = new Web3('http://localhost:8545')

    let { transaction, poster } = await makeRequests(5)

    await expect(ethUtils.sendTransactionWithDecryptedAccount(
        web3,
        { account: poster },
        transaction
    )).rejects.toThrow('GasTooLow')
})

test('Gas Too Low Throws GasTooLowError', async () => {
    let web3 = new Web3('http://localhost:8545')

    let { transaction, poster } = await makeRequests(5)

    await expect(ethUtils.sendTransactionWithDecryptedAccount(
        web3,
        { account: poster },
        transaction
    )).rejects.toBeInstanceOf(GasTooLowError)
})