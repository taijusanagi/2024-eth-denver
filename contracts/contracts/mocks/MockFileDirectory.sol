// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MockFileDirectory {
    function read(bytes memory name) public view returns (bytes memory, bool) {
        return (name, true);
    }
}
