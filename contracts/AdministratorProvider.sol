pragma solidity >= 0.4.22 < 0.7.0;

import './Administrator.sol';

contract AdministratorProvider {
    address public administratorProviderMinter;
    
    AdministratorInterface public administratorCollection;
    
    constructor(AdministratorInterface _administratorCollection) public {
        administratorProviderMinter = msg.sender;
        
        administratorCollection = _administratorCollection;
    }
    
    function setAdministratorCollection(AdministratorInterface _administratorCollection) payable public {
        require (administratorProviderMinter == msg.sender, 'Unauhtorized access!');
        
        administratorCollection = _administratorCollection;
    }
    
    function getAdministratorCollection() public view returns (AdministratorInterface) {
        return administratorCollection;
    }
}