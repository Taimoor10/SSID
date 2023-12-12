const contractABI = require('./addresses/CertificateABI')

exports.issue = async (web3, params, poster, estimatedGas) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    let grant = contract.methods.issue(params.address, params.number)

    estimatedGas = await grant.estimateGas({ from: poster.address })

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

    let revoke = contract.methods.revoke(params.address, params.number)

    estimatedGas = await revoke.estimateGas({ from: poster.address })

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

exports.hasCertificate = async (web3, params, poster) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    return contract.methods.hasCertificate(params.address, params.number).call({ from: poster.address })
}