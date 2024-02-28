// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

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
        _startBranchContent(_rootContentTokenId, msg.sender);
    }

    function endBranchContent() public {
        uint256 _branchContentId = activeBranchContentIds[msg.sender];
        _endBranchContent(msg.sender);
        _mintBranch(block.chainid, address(this), _branchContentId, msg.sender);
    }

    function _mintBranch(
        uint256 chainId,
        address directory,
        uint256 index,
        address creator
    ) internal {
        contentNFT.mintBranch(chainId, directory, index, creator);
    }

    // TODO: connect with L2
}
