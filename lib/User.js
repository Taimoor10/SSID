const makeIdentity = require('./makeIdentity')
const Identity = require('./Identity')

module.exports = User

function User(hex) {

    Object.defineProperty(this, 'account', {
        get: () => account,
        configurable: false,
        enumerable: true,
    })

    Object.defineProperty(this, 'id', {
        get: () => id,
        configurable: false,
        enumerable: true,
    })

    Object.defineProperty(this, 'key', {
        get: () => key,
        configurable: false,
        enumerable: true,
    })

    let { key, id } = this.createKeyPairFromHex(hex)

    let account = this.createEthereumAccount()
}

User.prototype = makeIdentity()
User.prototype.constructor = User

User.create = () => {
    let { key } = User.prototype.createKeyPair()

    let hex = User.prototype.web3.utils.bytesToHex(key.secretKey)

    return new User(hex)
}

User.fromWallet = (keyStoreJson, password) => {
    let { privateKey } = Identity.ethereumAccountFromWallet(
        User.prototype.web3,
        keyStoreJson,
        password
    )

    return new User(privateKey)
}

User.identificationTokenFor = (user, receiver) => {
    let { signature } = user.account.sign(user.id)

    let token = user.id + user.boxFor(receiver, signature)

    return Buffer.from(token).toString('base64')
}

User.identificationTokenFrom = (user, sender, token) => {
    let signature = user.openFrom(sender, token, true)

    let address = user.web3.eth.accounts.recover(sender, signature)

    return address
}

User.verifyIdentificationToken = (user, token) => {
    token = Buffer.from(token, 'base64').toString()

    let sender = token.slice(0, 66)

    return {
        id: sender,
        user: User.identificationTokenFrom(user, sender, token.slice(66))
    }
}