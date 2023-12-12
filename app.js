const express = require('express')
const bodyParser = require('body-parser')

const { app, httpServer } = require('./lib/web/httpServer')
const authentication = require('./routes/authentication')
const user = require('./routes/user')
const certificate = require('./routes/certificate')
const identity = require('./routes/identity')
let cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(express.static('public'))
app.use('/authentication', authentication)
app.use('/user', user)
app.use('/certificate', certificate)
app.use('/identity', identity)

httpServer.listen(3000, () => console.log('listening...'))