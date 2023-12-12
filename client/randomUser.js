const User = require('../lib/User')
const state = require('../tests/state.json');

const user = User.create()

console.log('user', {
    id: user.id,
    address: user.account.address,
    key: user.key,
    token: User.identificationTokenFor(user, state.administrators[0].publicKey)
})