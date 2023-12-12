const express = require('express')
const Web3 = require('web3')
const { wsServer } = require('../lib/web/wsServer')
const wsClients = require('../lib/web/wsClients')
const User = require('../lib/User')
const userContract = require('../contracts/User')
const state = require('../tests/state.json')

const web3 = new Web3('http://127.0.0.1:8545')
const router = express.Router()

module.exports = router

router.post('/request/validate', async (req, res) => {
    let authenticationRequestToken = req.body.token
    let server = new User(state.administrators[0].privateKey)
    let token = req.headers.authorization

    console.log(server, req.headers)
    if (token == undefined) {
        res.status(403).send()

        return
    }

    try {
        token = token.split(' ')[1]

        let { id, user } = User.verifyIdentificationToken(server, token)

        let ws = wsClients[authenticationRequestToken]

        if (ws == null || !wsServer.clients.has(ws)) {
            delete wsClients[ws]

            res.status(404).end()

            return
        }

        try {
            let currentStatus = await userContract.isUser(
                web3,
                { property: req.body.property },
                { address: server.account.address }
            )

            if (currentStatus == 0) {
                res.status(401).send()

                return
            }

            let storedId = await userContract.id(
                web3,
                { property: req.body.property },
                { address: server.account.address }
            )

            if (storedId != id) {
                res.status(401).send()

                return
            }
        }
        catch (err) {
            console.log(err)

            res.status(500).send()

            return
        }

        ws.send(user)

        res.end()
    }
    catch (err) {
        console.log(err)

        res.status(401).send()
    }
})

router.get('/test', async (req, res) => {
    console.log(req.headers.authorization)
    res.send(req.headers.authorization)
})