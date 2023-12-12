const nacl = require('tweetnacl')
nacl.util = require('tweetnacl-util')
const sha3_256 = require('js-sha3').sha3_256

module.exports = Identity

function Identity(hexString) {
    let keyPair = Object.freeze(this.keyPairFromExistingHexString(hexString))

    Object.defineProperty(this, 'keyPair', {
        get: () => keyPair,
        configurable: false,
        enumerable: false
    })
}

Identity.prototype.keyPairFromExistingHexString = function(hexString) {
    let keyPair = nacl.box.keyPair.fromSecretKey(Identity.utilities.uint8ArrayFromHexString(hexString))

    return keyPair
}

Identity.prototype.createRandomKeyPair = function() {
    let keyPair = nacl.box.keyPair()
    
    return keyPair
}

Identity.prototype.createRandom = function() {
    let keyPair = Identity.prototype.createRandomKeyPair()

    let identity = new Identity(Identity.utilities.uint8ArrayToHexString(keyPair.secretKey))

    return identity
}

Identity.prototype.publicKey = function() {
    let publicKey = Identity.utilities.uint8ArrayToHexString(this.keyPair.publicKey)

    return publicKey
}

Identity.prototype.secretKey = function() {
    let privateKey = Identity.utilities.uint8ArrayToHexString(this.keyPair.secretKey)

    return privateKey
}

Identity.prototype.address = function() {
    let address = Identity.utilities.getAddressFromPublicKey(Identity.utilities.uint8ArrayToHexString(this.keyPair.publicKey))

    return address
}

Identity.prototype.encryptFor = function(receiver, message) {
    let receiverBytes = Identity.utilities.uint8ArrayFromHexString(receiver)

    let nonce = nacl.randomBytes(24)

    let encryptedMessage = nacl.box(nacl.util.decodeUTF8(message), nonce, receiverBytes, this.keyPair.secretKey
    )

    nonce = Identity.utilities.uint8ArrayToHexString(nonce)
    encryptedMessage = Identity.utilities.uint8ArrayToHexString(encryptedMessage)

    return {
        nonce,
        encryptedMessage
    }
}

Identity.prototype.decryptFrom = function(sender, encryptedObject) {
    let senderBytes = Identity.utilities.uint8ArrayFromHexString(sender)

    let encryptedMessage = Identity.utilities.uint8ArrayFromHexString(encryptedObject.encryptedMessage)
    let nonce = Identity.utilities.uint8ArrayFromHexString(encryptedObject.nonce)

    let bytes = nacl.box.open(encryptedMessage, nonce, senderBytes, this.keyPair.secretKey)

    let message = nacl.util.encodeUTF8(bytes)

    return message
}

Identity.utilities = {}

/*
Vanila JS
Copied from: https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
Prepended: 0x
*/
Identity.utilities.uint8ArrayToHexString = function(bytes) {
    let hexString = '0x' + bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '')

    return hexString
}

/*
Vanila JS
Copied from: https://stackoverflow.com/questions/38987784/how-to-convert-a-hexadecimal-string-to-uint8array-and-back-in-javascript
For hexadecimal string prepended with 0x
*/
Identity.utilities.uint8ArrayFromHexString = function(hexString) {
    let bytes = new Uint8Array(hexString.substring(2).match(/.{1,2}/g).map(byte => parseInt(byte, 16)))

    return bytes
}

/*
For Address creation from Public Key prepended with 0x
*/
Identity.utilities.getAddressFromPublicKey = function(publicKey) {
     let bytes = sha3_256(publicKey)
     bytes = '0x' + bytes.substring(bytes.length-40)

     return bytes
}