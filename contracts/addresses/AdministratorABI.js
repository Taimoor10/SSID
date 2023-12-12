const administratorBuild = require('../../deployment/addresses/Administrator.json')

exports.address = administratorBuild.address

exports.abiModel = administratorBuild.abi

exports.http = 'http://localhost:8545';

exports.ws = 'ws://localhost:8546';
