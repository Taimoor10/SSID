pragma solidity >= 0.4.22 < 0.7.0;

interface AdministratorInterface {
    function grant(address _admin) external payable;
   
    function revoke(address _admin) external payable;
   
    function isAdministrator(address _admin) external view returns(bool);
}

contract Administrator is AdministratorInterface {
    address public administratorMinter;
   
    mapping (address => bool) administratorCollection;
    
    event AdministratorManipulated(address indexed _administrator, address indexed _admin, bool indexed _active);
   
    constructor() public {
        administratorMinter = msg.sender;
        
        administratorCollection[msg.sender] = true;

        emit AdministratorManipulated(msg.sender, msg.sender, true);
    }

    modifier onlyAdministrator(address _address) {
        require(isAdministrator(_address), 'Unauhtorized Access!');
        _;
    }

    function grant(address _address) onlyAdministrator(msg.sender) public payable {
        administratorCollection[_address] = true;

        emit AdministratorManipulated(msg.sender, _address, true);
    }
   
    function revoke(address _administrator) onlyAdministrator(msg.sender) public payable {
        administratorCollection[_administrator] = false;
        
        emit AdministratorManipulated(msg.sender, _administrator, false);
    }
   
    function isAdministrator(address _administrator) public view returns(bool) {
        return administratorCollection[_administrator];
    }
}