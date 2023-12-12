pragma solidity >=0.4.22 <0.7.0;

import './IssuerProvider.sol';

contract IsserDependent {
    IssuerProvider public issuerProvider;

    constructor(IssuerProvider _issuerProvider) public {
        issuerProvider = _issuerProvider;
    }

    modifier onlyIssuer(address _address) {
        require(issuerProvider.issuerCollection().isIssuer(_address), 'Unauthorized access!');
        _;
    }
}