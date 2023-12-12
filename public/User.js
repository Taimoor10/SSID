function User(web3, nacl, props = {}) {
    this.web3 = web3
    
    this.nacl = nacl
    
    this.props = props

    this.key = undefined

    let id = undefined

    let decryptedAccount = undefined

    this.generate = () => {
        this.key = nacl.box.keyPair()

        decryptedAccount = web3.eth.accounts.privateKeyToAccount(
            web3.utils.bytesToHex(this.key.secretKey)
        )
        
        id = web3.utils.bytesToHex(this.key.publicKey)
    }

    this.from = (hex) => {
        let secretKey = Uint8Array.from(
            web3.utils.hexToBytes(hex)
        )

        this.key = nacl.box.keyPair.fromSecretKey(secretKey)

        decryptedAccount = web3.eth.accounts.privateKeyToAccount(
            hex
        )

        id = web3.utils.bytesToHex(this.key.publicKey)
    }

    this.boxFor = (receiver, message) => {
        receiverPublicKey = Uint8Array.from(
            web3.utils.hexToBytes(receiver)
        )

        let nonce = nacl.randomBytes(24)

        let box = nacl.box(
            nacl.util.decodeUTF8(message),
            nonce,
            receiverPublicKey,
            this.key.secretKey
        )

        return {
            nonce,
            box
        }
    }

    this.openFrom = (sender, box, asUTF8 = false) => {
        senderPublicKey = Uint8Array.from(
            web3.utils.hexToBytes(sender)
        )

        let message = nacl.box.open(box.box, box.nonce, senderPublicKey, this.key.secretKey)

        return asUTF8 ? nacl.util.encodeUTF8(message) : message
    }

    this.encrypt = (password) => {
        return web3.eth.accounts.encrypt(this.account.privateKey, password)
    }

    this.decrypt = (keyStoreJson, password) => {
        decryptedAccount = web3.eth.accounts.decrypt(keyStoreJson, password)

        secretKey = Uint8Array.from(
            web3.utils.hexToBytes(decryptedAccount.privateKey)
        )

        this.key = nacl.box.keyPair.fromSecretKey(secretKey)

        id = web3.utils.bytesToHex(this.key.publicKey)
    }

    this.hashed = (property) => {
        return web3.utils.keccak256(this.props[property])
    }

    Object.defineProperty(this, 'account', {
        get: () =>  decryptedAccount
    })

    Object.defineProperty(this, 'id', {
        get: () => id
    })

    this.generate()
}