const userBuild = require('../../deployment/addresses/User.json')

exports.address = userBuild.address

exports.abiModel = userBuild.abi

exports.http = 'http://localhost:8545';

exports.ws = 'ws://localhost:8546'; 
