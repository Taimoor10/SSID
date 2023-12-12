const express = require('express')
const ServerIdentity = require('../serverIdentity')
const router = express.Router()

module.exports = router

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