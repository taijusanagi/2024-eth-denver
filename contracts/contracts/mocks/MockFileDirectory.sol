// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract MockFileDirectory {
    mapping(bytes => bytes) private kv;

    function write(bytes memory name, bytes memory data) external payable {
        kv[name] = data;
    }

    function read(bytes memory name) public view returns (bytes memory, bool) {
        return (kv[name], kv[name].length >= 0);
    }
}
