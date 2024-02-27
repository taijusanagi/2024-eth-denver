// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "./libs/Content.sol";
import "./StoryBranchMinter.sol";
import "./ContentNFT.sol";

contract StoryBranchMinterL1 is StoryBranchMinter {
    ContentNFT public contentNFT;

    constructor(ContentNFT _contentNFT) {
        contentNFT = _contentNFT;
    }

    function startBranchContent(uint256 _rootContentTokenId) public {
        RootContentLocatioin memory _rootContentLocation = contentNFT
            .rootContentLocations(_rootContentTokenId);
        require(
            _rootContentLocation.directory != address(0),
            "StoryBranchMinterL1: Invalid tokenId"
        );
        _startBranchContent(
            _rootContentLocation.directory,
            _rootContentLocation.name,
            msg.sender
        );
    }

    // TODO: connect with L2
}
