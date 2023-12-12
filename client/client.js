const WebSocket = require('ws')
const qrcode = require('qrcode-terminal')

const ws = new WebSocket('ws://localhost:3000')

ws.onopen = () => {
    console.log('connected...')
}

ws.onclose = () => {
    console.log('disconnected...')
}

ws.on('message', (message) => {
    qrcode.generate(message)

    console.log(message)
})