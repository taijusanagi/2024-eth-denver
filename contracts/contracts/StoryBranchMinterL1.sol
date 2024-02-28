// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import "./ContentNFT.sol";
import "./StoryBranchMinter.sol";

contract StoryBranchMinterL1 is StoryBranchMinter {
    ContentNFT public contentNFT;

    constructor(
        address functionRouter,
        uint64 functionSubscriptionId,
        uint32 functionGasLimit,
        bytes32 functionDonId,
        ContentNFT contentNFT_
    )
        StoryBranchMinter(
            functionRouter,
            functionSubscriptionId,
            functionGasLimit,
            functionDonId
        )
    {
        contentNFT = contentNFT_;
    }

    function startBranchContent(uint256 rootContentTokenId) public {
        (address directory, bytes memory name) = contentNFT
            .rootContentLocations(rootContentTokenId);
        require(
            directory != address(0),
            "StoryBranchMinterL1: Invalid tokenId"
        );
        _startBranchContent(rootContentTokenId, msg.sender);
    }

    function endBranchContent() public {
        _endBranchContent(msg.sender);
        uint256 branchContentId = activeBranchContentIds[msg.sender];
        uint256 rootTokenId = rootTokenIds[branchContentId];
        _mintBranch(
            rootTokenId,
            block.chainid,
            address(this),
            branchContentId,
            msg.sender
        );
    }

    function _mintBranch(
        uint256 rootTokenId,
        uint256 chainId,
        address directory,
        uint256 index,
        address creator
    ) internal {
        contentNFT.mintBranch(rootTokenId, chainId, directory, index, creator);
    }

    // TODO: connect with L2
}
