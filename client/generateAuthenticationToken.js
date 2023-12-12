const User = require('../lib/User')
const state = require('../tests/state.json');

const user = new User('0x5a5a28d76f5d752d654f49a95d46e53c4a8bf0c35a35c83041a761d6e6ef616a');

const administrator = new User(state.administrators[0].privateKey)

console.log('user', {
    id: user.id,
    address: user.account.address,
    key: user.key,
    token: User.identificationTokenFor(user, state.administrators[0].publicKey)
})

console.log('administrator', {
    id: administrator.id,
    address: administrator.account.address,
    key: administrator.key,
    token: User.identificationTokenFor(administrator, state.administrators[0].publicKey)
})