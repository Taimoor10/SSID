pragma solidity >=0.4.22 <0.7.0;

import "./User.sol";

contract UserProvider {
    address public userProviderMinter;

    UserInterface public userCollection;

    constructor(UserInterface _userCollection) public {
        userProviderMinter = msg.sender;

        userCollection = _userCollection;
    }

    function setIssuerCollection(UserInterface _userCollection) public payable {
        require(userProviderMinter == msg.sender, "Unauthorized acccess!");

        userCollection = _userCollection;
    }
}
