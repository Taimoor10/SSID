//The web3 instance to interact with Ethereum plus it provides hashing, encoding and cryptography
let web3 = new Web3()

//User depends on web3 and nacl - nacl is cryptography library, that helps us with encryption and message signing
let user = new User(web3, nacl, {
        email: 'someemail@somedomaisadfasdfafasdn.com'
    }
)

//Server's public key is announced
let server = {
    id: '0x82bbe1fca2c9dea13ef4247f09d2818e6d80515acd28333535f0fa0a4f24de38'
}

console.log('email (hashed):', user.hashed('email'))
console.log('id (publicKey): ', user.id)
console.log('address (EOA on ethereum):', user.account.address)

//Example signup request
console.log( 'Sample request',
    {
        "email": "0x311608a3f3080b61a86f98b138269f15ab8c1d4bd40282922cbe1b9489fdd019",
        "id": "0xf03fd9b7915ad65e7392446d05718f6c5e1c8caf31dd3b2319fd3622e20a9b5e",
        "address": "0x16b4431A244EF66801674F25B1c2a692255Ae658",
        "sign": {
            "nonce": "0xbfbcbb5bd35b2ad40029b60495e6c4eae3dd9e781f9e6017",
            "box": "0xb8847287863e588b580134c9a5cee5b1ebf6838e96a5"
        }
    }
)

//Existing properties of signup request
let request = {
    email: user.hashed('email'),
    id: user.id,
    address: user.account.address
}

console.log('Properties of the request object that we have, sign property is missing though',
    request
)

console.log('Calculating sign...',
    'An encrypted message signed for the recipient...',
    'The message we encrypt is "signup", using user\'s private key and server\'s public key...'
)

let sign = user.boxFor(server.id, 'signup')

console.log('Converting, the properties (nonce and box) of sign object to hex')

sign.nonce = web3.utils.bytesToHex(sign.nonce)
sign.box = web3.utils.bytesToHex(sign.box)

request.sign = sign

console.log('Our current request...', request)

//Sending the sign up request
fetch('http://localhost:3000/user/signup', {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
}).then(response => {
    if (response.status == 400)
        console.error('email already registered!')

    //We have send email's hash
    fetch('http://localhost:3000/user/is?email=' + user.hashed('email')).then(
        response => {
            response.json().then(json => {
                console.log('User exists with status code: ' + json.status)
            })
        }).catch(console.error)
}).catch(console.error)