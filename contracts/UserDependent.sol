pragma solidity >= 0.4.22 < 0.7.0;

import './UserProvider.sol';

contract UserDependent {
    UserProvider public userProvider;

    constructor(UserProvider _userProvider) public {
        userProvider = _userProvider;
    }

    modifier onlyUser(address _address) {
        uint256 property = userProvider.userCollection().property(_address);
        require(userProvider.userCollection().isUser(property) != 0, 'Unauthorized access!');
        _;
    }
}