// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import "./StoryBranchMinter.sol";

contract StoryBranchMinterL2 is StoryBranchMinter {
    constructor(
        address functionRouter,
        uint64 functionSubscriptionId,
        uint32 functionGasLimit,
        bytes32 functionDonId
    )
        StoryBranchMinter(
            functionRouter,
            functionSubscriptionId,
            functionGasLimit,
            functionDonId
        )
    {}

    function startBranchContent(
        uint256 rootContentTokenId,
        address directory,
        bytes memory name
    ) public {
        // TODO: validate the content actualy exist using wormhole query
        _startBranchContent(rootContentTokenId, msg.sender);
    }

    // TODO: connect with L1
}
