// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IFlatDirectory {
    function files(bytes memory filename) external view returns (bytes memory);
}
