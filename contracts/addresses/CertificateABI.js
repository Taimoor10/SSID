const certificateBuild = require('../../deployment/addresses/Certificate.json')

exports.address = certificateBuild.address

exports.abiModel = certificateBuild.abi

exports.http = 'http://localhost:8545';

exports.ws = 'ws://localhost:8545';