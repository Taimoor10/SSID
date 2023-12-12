const express = require('express')
const Web3 = require('web3')
const User = require('../lib/User')
const userContract = require('../contracts/User')
const ethUtils = require('../utils/ethUtils')
const state = require('../tests/state.json')
const gasEstimates = require('../tests/gasEstimates.json')
const ServerIdentity = require('../serverIdentity')

const web3 = new Web3('http://127.0.0.1:8545')
const router = express.Router()

module.exports = router

router.post('/signup', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)
    let token = req.headers.authorization

    if (token == undefined) {
        res.status(403).send()

        return
    }

    try {
        token = token.split(' ')[1]

        let { id, user } = User.verifyIdentificationToken(server, token)
        console.log("Id:" , id,
                    "user:", user)

        try {
            let currentStatus = await userContract.isUser(
                web3,
                {
                    property: req.body.property
                },
                {
                    address: server.account.address
                }
            )
            if (currentStatus != 0) {
                res.status(422).send()

                return
            }
        }
        catch (err) {
            console.log(err)

            res.status(500).send()

            return
        }

        //Status 2 represents email not verified
        //Can be any business logic
        let status = 2

        userContract.signUp(
            web3,
            {
                property: req.body.property,
                user,
                id,
                status
            },
            server.account,
            gasEstimates.User.signUp
        ).then(transaction => {
            ethUtils.sendTransactionWithDecryptedAccount(
                web3,
                server,
                transaction
            )
                .then(receipt => {
                    console.log(receipt)

                    res.status(200).send()
                }).catch(err => {
                    console.log(err)

                    res.status(500).send()
                })
        }).catch(err => {
            console.error(err)

            res.status(500).send()
        })
    }
    catch (err) {
        console.log(err)

        res.status(401).send()
    }
})

router.get('/is', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)

    userContract.isUser(
        web3,
        {
            property: req.query.property
        },
        {
            address: server.account.address
        }
    ).then(status => {
        res.status(200).send({ status })
    }).catch(err => {
        console.error(err)

        res.statusCode(500).send()
    })
})


router.get('/id', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)

    userContract.id(
        web3,
        {
            property: req.query.property
        },
        {
            address: server.account.address
        }
    ).then(id => {
        res.status(200).send({ id })
    }).catch(err => {
        res.status(500).send()
    })
})

router.post('/encrypt', (req, res) => {
    try {
        let encryptedObject = ServerIdentity.encryptFor(req.body.for, req.body.message)

        res.status(200).send(encryptedObject)
    }
    catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.post('/decrypt', (req, res) => {
    try {
        let message = ServerIdentity.decryptFrom(req.body.from, req.body.encryptedObject)

        res.status(200).send(message)
    }

    catch (err) {
        console.log(err)
        res.status(500).send()
    }
})

router.get('/publicKey', (req, res) => {
    res.send(ServerIdentity.publicKey())
})

router.get('/address', (req,res) => {
    res.send(ServerIdentity.address())
})