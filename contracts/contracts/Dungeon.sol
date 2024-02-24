// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Dungeon {
    enum TileType {
        Wall,
        Plain
    } // Enum to represent tile types

    int public width;
    uint public height;
    uint public maxTunnels;
    uint public maxLength;
    TileType[][] public map; // 2D array for map
    uint public maxDistance;
    // Positions stored as two separate uints for simplicity
    uint public startX;
    uint public startY;
    uint public endX;
    uint public endY;

    constructor(uint _width, uint _height, uint _maxTunnels, uint _maxLength) {
        width = _width;
        height = _height;
        maxTunnels = _maxTunnels;
        maxLength = _maxLength;
        generateMap();
    }
}
