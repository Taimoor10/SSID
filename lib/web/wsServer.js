const Web3 = require('web3')
const WebSocket = require('ws')

const { httpServer } = require('./httpServer')
const wsClients = require('./wsClients')

const web3 = new Web3()
const wsServer = new WebSocket.Server({ server: httpServer })

exports.wsServer = wsServer

wsServer.on('connection', (ws, request) => {
    let authenticationTokenRequest = web3.utils.randomHex(4)

    ws.on('close', function () {
        console.log(`${this.authenticationTokenRequest} disconnected...`)

        delete wsClients[this.authenticationTokenRequest]
    })

    ws.on('pong', function () {
        console.log(`${this.authenticationTokenRequest} pinged...`)

        this.isAlive = true
    })

    ws.authenticationTokenRequest = authenticationTokenRequest
    wsClients[authenticationTokenRequest] = ws

    ws.send(JSON.stringify({
        event: 'authenticationRequestToken',
        authenticationTokenRequest
    }))
})

const houseKeepClients = setInterval(() => {
    console.log('houseKeeping...')
    wsServer.clients.forEach((ws) => {
        if (ws.isAlive === false)
            return ws.terminate()

        ws.isAlive = false
    })
}, 60000)