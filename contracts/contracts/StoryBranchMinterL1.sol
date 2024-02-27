// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

import "./ContentNFT.sol";
import "./StoryBranchMinter.sol";

contract StoryBranchMinterL1 is StoryBranchMinter {
    ContentNFT public contentNFT;

    constructor(
        address _functionRouter,
        uint64 _functionSubscriptionId,
        uint32 _functionGasLimit,
        bytes32 _functionDonId,
        ContentNFT _contentNFT
    )
        StoryBranchMinter(
            _functionRouter,
            _functionSubscriptionId,
            _functionGasLimit,
            _functionDonId
        )
    {
        contentNFT = _contentNFT;
    }

    function startBranchContent(uint256 _rootContentTokenId) public {
        (address _directory, bytes memory _name) = contentNFT
            .rootContentLocations(_rootContentTokenId);
        require(
            _directory != address(0),
            "StoryBranchMinterL1: Invalid tokenId"
        );
        _startBranchContent(_directory, _name, msg.sender);
    }

    // TODO: connect with L2
}
