pragma solidity ^0.8.4;

contract UpgradeContractV1 {

    uint256 public value;

    function increaseValue() external {
        value  += 1;
    }

}