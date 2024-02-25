// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

contract StoryGameNFT {
    string public baseStory;
    uint256 public totalStoryIndex;
    mapping(address => uint256) public currentOwnStoryIndex;
    mapping(uint256 => string[]) public interactions;
    mapping(uint256 => string[]) public responds;
    mapping(uint256 => bool) public isWaitingResponse;

    constructor(string memory _baseStory) {
        baseStory = _baseStory;
    }

    function start() public {
        require(currentOwnStoryIndex[msg.sender] == 0, "invalid");
        totalStoryIndex++;
        currentOwnStoryIndex[msg.sender] = totalStoryIndex;
    }

    function end() public {
        require(currentOwnStoryIndex[msg.sender] != 0, "invalid");
        delete currentOwnStoryIndex[msg.sender];

        // publish in story protocol
    }

    function interact(string memory _interaction) public {
        uint256 ownStoryIndex = currentOwnStoryIndex[msg.sender];
        require(!isWaitingResponse[ownStoryIndex], "invalid");
        isWaitingResponse[ownStoryIndex] = true;
        interactions[ownStoryIndex].push(_interaction);

        // send request to chain link
    }

    function respond(string memory _respond) public {
        uint256 ownStoryIndex = currentOwnStoryIndex[msg.sender];
        require(isWaitingResponse[ownStoryIndex], "invalid");
        isWaitingResponse[ownStoryIndex] = true;
        responds[ownStoryIndex].push(_respond);

        // process request from chain link
    }
}
