const path = require('path')
const fs = require('fs')
const { DomainError, GasTooLowError } = require('../lib/errors')

exports.deploy = async (web3, name, poster, buildPath, addressesPath, arguments1) => {
    const contractABIFile = path.join(buildPath, name + '.json')
    const contractABI = require(contractABIFile)
    const deployedABIFile = path.join(addressesPath, name + '.json')
    let deployedContract, estimatedGas, transaction, signedTransaction, receipt;

    const contract = new web3.eth.Contract(contractABI.abi);

    if (arguments1 === false)
        deployedContract = contract.deploy({
            data: contractABI.bytecode
        });
    else
        deployedContract = contract.deploy({
            data: contractABI.bytecode,
            arguments: arguments1
        });

    estimatedGas = await deployedContract.estimateGas({from: poster.address})

    transaction = {
        from: poster.address,
        data: deployedContract.encodeABI(),
        gas: estimatedGas
    }

    signedTransaction = await poster.account.signTransaction(transaction)

    receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

    await new Promise((resolve, reject) => {
        fs.writeFile(
            deployedABIFile,
            JSON.stringify({
                address: receipt.contractAddress,
                abi: contractABI.abi
            }),
            () => {
                resolve(true)
            }
        )
    })

    return receipt
}

exports.sendTransactionWithDecryptedAccount = async (web3, poster, transaction) => {
    
    try {
        let signedTransaction = await poster.account.signTransaction(transaction)

        receipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)

        return receipt
    }
    catch (err) {
        if (err.message == 'Invalid JSON RPC response: ""')
            throw new DomainError('ConnectionError')
        
        else if (this.isGasTooLow(err.message))
            throw new GasTooLowError('GasTooLow', this.gasFromError(err.message))
        
        else
            throw err
    }
}

exports.privateKeyToAccount = (web3, key) => {
    try {
        return web3.eth.accounts.privateKeyToAccount(key)
    }
    catch (err) {
        throw Error('InvalidKey')
    }
}

exports.isGasTooLow = (message) => {
    return message.includes('gas limit is too low')
}

exports.gasFromError = (message) => {
    return message.split(' ').pop()
}