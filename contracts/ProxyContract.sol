pragma solidity ^0.8.4;

contract ProxyContract {
    uint256 public value;
    address public owner;
    address public logicContract;

    constructor(address _address) {
        logicContract = _address;
        owner = msg.sender;
    }

    function upgrade(address _upgradeContract) external {
        require(msg.sender == owner, "Only owner can do this");
        logicContract = _upgradeContract;
    }

    fallback() external {
        (bool success, ) =  logicContract.delegatecall(msg.data);
        require(success, "undefine error");
    }
}