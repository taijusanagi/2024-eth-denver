// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

contract Dungeon {
    uint256 public seed;
    uint256 public width;
    uint256 public height;
    uint256 public maxTunnels;
    uint256 public maxLength;
    uint256[][] public map;
    // uint256 public currentDiceNumber;
    // uint256 public currentDiceNumber;

    constructor(
        uint256 _seed,
        uint256 _width,
        uint256 _height,
        uint256 _maxTunnels,
        uint256 _maxLength
    ) {
        seed = _seed;
        width = _width;
        height = _height;
        maxTunnels = _maxTunnels;
        maxLength = _maxLength;
        generateMap();
    }

    function getMap() public view returns (uint256[][] memory) {
        return map;
    }

    function generateMap() private {
        for (uint x = 0; x < width; x++) {
            uint[] memory newRow = new uint[](height);
            for (uint y = 0; y < height; y++) {
                newRow[y] = 0;
            }
            map.push(newRow);
        }
        uint256 randomValue = random();
        uint currentX = randomValue % width;
        uint currentY = randomValue % height;
        map[currentX][currentY] = 1;
        for (uint i = 0; i < maxTunnels; i++) {
            uint256 randomValueWithNonce = randomWithNonce(i);
            uint tunnelLength = (randomValueWithNonce % maxLength) + 1;
            uint direction = randomValueWithNonce % 4;
            (int dy, int dx) = getDirection(direction);
            for (uint j = 0; j < tunnelLength; j++) {
                currentX = uint(int(currentX) + dx);
                currentY = uint(int(currentY) + dy);
                if (
                    currentX < 0 ||
                    currentX >= width ||
                    currentY < 0 ||
                    currentY >= height
                ) {
                    currentX = uint(int(currentX) - dx);
                    currentY = uint(int(currentY) - dy);
                    break;
                }
                if (map[currentX][currentY] == 0) {
                    map[currentX][currentY] = 1;
                }
            }
        }
    }

    function getDirection(uint direction) private pure returns (int, int) {
        if (direction == 0) return (0, 1);
        if (direction == 1) return (1, 0);
        if (direction == 2) return (0, -1);
        if (direction == 3) return (-1, 0);
        revert("Invalid direction");
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(seed)));
    }

    function randomWithNonce(uint256 nonce) private view returns (uint) {
        return uint(keccak256(abi.encodePacked(seed, nonce)));
    }
}
