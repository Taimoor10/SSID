const express = require('express')
const Web3 = require('web3')
const User = require('../lib/User')
const administratorContract = require('../contracts/Administrator')
const certificateContract = require('../contracts/Certificate')
const ethUtils = require('../utils/ethUtils')
const state = require('../tests/state.json')
const gasEstimates = require('../tests/gasEstimates.json')

const web3 = new Web3('http://127.0.0.1:8545')
const router = express.Router()

module.exports = router

router.post('/issue', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)
    let token = req.headers.authorization

    if (token == undefined) {
        res.send(403).send()

        return
    }

    try {
        token = token.split(' ')[1]

        let { id, user } = User.verifyIdentificationToken(server, token)

        console.log({
            'id': id,
            'address': user
        })

        try {
            let isAAdministrator = await administratorContract.isAdministrator(
                web3,
                {
                    address: user
                },
                {
                    address: server.account.address
                }
            )

            if (isAAdministrator == false) {
                res.status(401).send()

                return
            }
        }
        catch (err) {
            console.log(err)

            res.status(500).send()

            return
        }

        try {
            certificateContract.issue(
                web3,
                {
                    address: req.body.address,
                    number: req.body.number
                },
                server.account,
                50000
            ).then(transaction => {
                ethUtils.sendTransactionWithDecryptedAccount(
                    web3,
                    server,
                    transaction
                ).then(receipt => {
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

            res.status(500).send()
        }
    }
    catch (err) {
        console.log(err)

        res.status(401).send()
    }
})

router.post('/revoke', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)
    let token = req.headers.authorization

    if (token == undefined) {
        res.send(403).send()

        return
    }

    try {
        token = token.split(' ')[1]

        let { id, user } = User.verifyIdentificationToken(server, token)

        console.log({
            'id': id,
            'address': user
        })

        try {
            let isAAdministrator = await administratorContract.isAdministrator(
                web3,
                {
                    address: user
                },
                {
                    address: server.account.address
                }
            )

            if (isAAdministrator == false) {
                res.status(401).send()

                return
            }
        }
        catch (err) {
            console.log(err)

            res.status(500).send()

            return
        }

        try {
            certificateContract.revoke(
                web3,
                {
                    address: req.body.address,
                    number: req.body.number
                },
                server.account,
                50000
            ).then(transaction => {
                ethUtils.sendTransactionWithDecryptedAccount(
                    web3,
                    server,
                    transaction
                ).then(receipt => {
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

            res.status(500).send()
        }
    }
    catch (err) {
        console.log(err)

        res.status(401).send()
    }
})

router.get('/has', async (req, res) => {
    let server = new User(state.administrators[0].privateKey)

    certificateContract.hasCertificate(
        web3,
        {
            address: req.query.address,
            number: req.query.number
        },
        {
            address: server.account.address
        }
    ).then(status => {
        res.status(200).send({ status })
    }).catch(err => {
        res.status(500).send()
    })
})