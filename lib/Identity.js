module.exports = Identity

function Identity(web3, nacl) {

    Object.defineProperty(this, 'web3', {
        get: () => web3,
        configurable: false,
        enumerable: true
    })

    Object.defineProperty(this, 'nacl', {
        get: () => nacl,
        configurable: false,
        enumerable: true
    })

    this.boxFor = function (receiver, message) {
        let { nonce, box } = Identity.boxFor(web3, nacl, this.key.secretKey, receiver, message)

        return web3.utils.bytesToHex(Uint8Array.from([...nonce, ...box]))
    }

    this.openFrom = function (sender, box, asUTF8 = false) {
        box = Uint8Array.from(web3.utils.hexToBytes(box))

        box = {
            nonce: Uint8Array.from(box.slice(0, 24)),
            box: Uint8Array.from(box.slice(24))
        }

        return Identity.openFrom(web3, nacl, this.key.secretKey, sender, box, asUTF8)
    }

    this.createWallet = function (password) {
        return Identity.createWallet(web3, this.account.privateKey, password)
    }

    this.createEthereumAccount = function () {
        return Identity.createEthereumAccount(web3, this.key.secretKey)
    }

    this.createKeyPair = () => Identity.createKeyPair(web3, nacl)

    this.createKeyPairFromHex = (hex) => Identity.createKeyPairFromHex(web3, nacl, hex)
}

Identity.createKeyPair = (web3, nacl) => {
    let key = nacl.box.keyPair()
    return { key: key, id: web3.utils.bytesToHex(key.publicKey) }
}

Identity.createKeyPairFromHex = (web3, nacl, hex) => {
    let secretKey = Uint8Array.from(web3.utils.hexToBytes(hex))
    let key = nacl.box.keyPair.fromSecretKey(secretKey)

    return {
        key: nacl.box.keyPair.fromSecretKey(secretKey),
        id: web3.utils.bytesToHex(key.publicKey)
    }
}

Identity.createEthereumAccount = (web3, secretKey) => web3.eth.accounts.privateKeyToAccount(web3.utils.bytesToHex(secretKey))

Identity.ethereumAccountFromWallet = (web3, keyStoreJson, password) => {
    return web3.eth.accounts.decrypt(keyStoreJson, password)
}

Identity.createWallet = (web3, hex, password) => {
    return web3.eth.accounts.encrypt(hex, password)
}

Identity.boxFor = (web3, nacl, secretKey, receiver, message) => {
    receiverPublicKey = Uint8Array.from(
        web3.utils.hexToBytes(receiver)
    )

    let nonce = nacl.randomBytes(24)

    let box = nacl.box(
        nacl.util.decodeUTF8(message),
        nonce,
        receiverPublicKey,
        secretKey
    )

    return {
        nonce,
        box
    }
}

Identity.openFrom = (web3, nacl, secretKey, sender, box, asUTF8 = false) => {
    senderPublicKey = Uint8Array.from(
        web3.utils.hexToBytes(sender)
    )

    let message = nacl.box.open(box.box, box.nonce, senderPublicKey, secretKey)

    return asUTF8 ? nacl.util.encodeUTF8(message) : message
}
