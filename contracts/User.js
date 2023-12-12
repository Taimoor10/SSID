const contractABI = require('./addresses/UserABI')

exports.signUp = async (web3, params, poster, estimatedGas) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    let signUp = contract.methods.signUp(
        web3.utils.keccak256(params.property),
        params.user,
        params.id,
        params.status
    )

    estimatedGas = await signUp.estimateGas({ from: poster.address })

    let transaction = {
        from: poster.address,
        to: contractABI.address,
        data: signUp.encodeABI(),
        gas: estimatedGas
    }

    return transaction
}

exports.isUser = async (web3, params, poster) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)

    return contract.methods.isUser(web3.utils.keccak256(params.property)).call(
        { from: poster.address }
    )
}

exports.id = async (web3, params, poster) => {
    let contract = new web3.eth.Contract(contractABI.abiModel, contractABI.address)


    return contract.methods.id(web3.utils.keccak256(params.property)).call(
        { from: poster.address }
    ).then(result => {
        return web3.utils.toHex(result)
    })
}