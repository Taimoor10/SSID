pragma solidity >=0.4.22 <0.7.0;

import './Issuer.sol';

contract IssuerProvider {
    address public issuerProviderMinter;

    IssuerInterface public issuerCollection;

    constructor(IssuerInterface _issuerCollection) public {
        issuerProviderMinter = msg.sender;

        issuerCollection = _issuerCollection;
    }

    function setIssuerCollection(IssuerInterface _issuerCollection) payable public {
        require (issuerProviderMinter == msg.sender, 'Unauthorized access!');

        issuerCollection = _issuerCollection;
    }
}