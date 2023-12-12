pragma solidity >=0.4.22 <0.7.0;

import './AdministratorDependent.sol';
import './UserDependent.sol';

interface IssuerInterface {
    function grant(address _issuer) external payable;
    
    function revoke(address _issuer) external payable;
    
    function isIssuer(address _issuer) external view returns (bool);
}

contract Issuer is AdministratorDependent, UserDependent, IssuerInterface {
    
    AdministratorProvider public administratorProvider;
    UserProvider public userProvider;
    
    mapping (address => bool) issuerCollection;
    
    event IssuerManiuplated(address indexed _administrator, address indexed _issuer, bool indexed _active);
    
    constructor(AdministratorProvider _administratorProvider, UserProvider _userProvider)
        onlyAdministrator(msg.sender)
        AdministratorDependent(_administratorProvider)
        UserDependent(_userProvider)
    public {
        administratorProvider = _administratorProvider;
        userProvider = _userProvider;
    }
    
    function grant(address _address)
        onlyUser(_address)
        onlyAdministrator(msg.sender)
    public payable {
        issuerCollection[_address] = true;
        
        emit IssuerManiuplated(msg.sender, _address, true);
    }
    
    function revoke(address _issuer)
        onlyUser(_issuer)
        onlyAdministrator(msg.sender)
    public payable {
        issuerCollection[_issuer] = false;
        
        emit IssuerManiuplated(msg.sender, _issuer, false);
    }
    
    function isIssuer(address _issuer) public view returns (bool) {
        return issuerCollection[_issuer];
    }
}