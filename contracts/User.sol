pragma solidity >= 0.4.22 < 0.7.0;

import './AdministratorDependent.sol';

interface UserInterface {
    function signUp(uint256 _property, address _user, string calldata _id, uint256 _status) external payable;
    
    function isUser(uint256 _property) external view returns (uint256);
    
    function id(uint256 _property) external view returns (string memory);

    function property(address _address) external view returns (uint256);
}

contract User is UserInterface, AdministratorDependent {
    struct UserData {
        uint256 property;
        address user;
        string id;
        uint256 status;
    }
    
    address userMinter;
    
    mapping (uint256 => UserData) userCollection;
    mapping (address => uint256) addressPropertyCollection;
    
    event UserManipulated(uint256 indexed _property, address indexed _user, string indexed _id, uint256 _status);

    constructor(AdministratorProvider _administratorProvider)
        onlyAdministrator(msg.sender)
        AdministratorDependent(_administratorProvider)
    public {
        userMinter = msg.sender;
    }
    
    function signUp(uint256 _property, address _user, string memory _id, uint256 _status) public payable {
        require (isUser(_property) == 0, 'Email already registered!');
        
        require (addressPropertyCollection[_user] == 0, 'Provided address already exists for some property!');

        userCollection[_property].property = _property;
        userCollection[_property].user = _user;
        userCollection[_property].id = _id;
        userCollection[_property].status = _status;
        
        addressPropertyCollection[_user] = _property;

        emit UserManipulated(_property, _user, _id, _status);
    }
    
    function isUser(uint256 _property) public view returns (uint256) {
        return userCollection[_property].status;
    }
    
    function id(uint256 _property) public view returns (string memory) {
        return userCollection[_property].id;
    }

    function property(address _address) public view returns (uint256) {
        return addressPropertyCollection[_address];
    }
}
