pragma solidity >=0.4.22 <0.7.0;

import './AdministratorDependent.sol';
import './UserDependent.sol';

interface CertificateInterface {
    function issue(address _address, uint256 _number) external payable;

    function revoke(address _address, uint256 _number) external payable;

    function hasCertificate(address _address, uint256 _number) external view returns (bool);
}

contract Certificate is AdministratorDependent, UserDependent, CertificateInterface {

    AdministratorProvider public administratorProvider;
    UserProvider public userProvider;

    mapping (address => mapping (uint256 => bool)) certificateCollection;

    event CertificateManipulated(address indexed _administrator, address indexed _user, uint256 indexed _number, bool _active);

    constructor(AdministratorProvider _administratorProvider, UserProvider _userProvider) 
        onlyAdministrator(msg.sender)
        AdministratorDependent(_administratorProvider)
        UserDependent(_userProvider)
    public {
        administratorProvider = _administratorProvider;
        userProvider = _userProvider;
    }

    function issue(address _address, uint256 _number)
        onlyUser(_address)
        onlyAdministrator(msg.sender)
    public payable {
        certificateCollection[_address][_number] = true;

        emit CertificateManipulated(msg.sender, _address, _number, true);
    }

    function revoke(address _address, uint256 _number)
        onlyUser(_address)
        onlyAdministrator(msg.sender)
    public payable {
        
        //insert require to check the certificate issuance

        certificateCollection[_address][_number] = false;

        emit CertificateManipulated(msg.sender, _address, _number, false);
    }

    function hasCertificate(address _address, uint256 _number) public view returns (bool) {
        return certificateCollection[_address][_number];
    }
}