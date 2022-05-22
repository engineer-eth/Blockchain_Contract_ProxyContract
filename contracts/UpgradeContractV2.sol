pragma solidity ^0.8.4;

contract UpgradeContractV2 {

    uint256 public value;
    uint256 public otherValue;

    function increaseValue() external {
        value  += 2;
    }

    function setOtherValue(uint256 _value) external {
        otherValue = _value;
    }

    function increaseOtherValue() external {
        otherValue  += 5;
    }
}