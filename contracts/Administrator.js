const contractABI = require('./addresses/AdministratorABI')

exports.grant = async (web3, params, poster, estimatedGas) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    let grant = contract.methods.grant(params.address)

    let nonce = await web3.eth.getTransactionCount(poster.address)

    let transaction = {
        nonce: nonce,
        from: poster.address,
        to: contractABI.address,
        data: grant.encodeABI(),
        gas: estimatedGas
    }

    return transaction
}

exports.revoke = async (web3, params, poster, estimatedGas) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    let revoke = contract.methods.revoke(params.address)

    let nonce = await web3.eth.getTransactionCount(poster.address)

    let transaction = {
        nonce: nonce,
        from: poster.address,
        to: contractABI.address,
        data: revoke.encodeABI(),
        gas: estimatedGas
    }

    return transaction
}

exports.isAdministrator = async (web3, params, poster) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    return contract.methods.isAdministrator(params.address).call({ from: poster.address })
}