pragma solidity >= 0.4.22 < 0.7.0;

import './AdministratorProvider.sol';

contract AdministratorDependent {
    AdministratorProvider public administratorProvider;
    
    constructor(AdministratorProvider _administratorProvider) public {
        administratorProvider = _administratorProvider;
    }
    
    modifier onlyAdministrator(address _address) {
        require(administratorProvider.administratorCollection().isAdministrator(msg.sender), 'Unauthorized Access!');
        _;
    }
}