// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

import "./StoryBranchMinter.sol";

contract StoryBranchMinterL2 is StoryBranchMinter {
    constructor(
        address _functionRouter,
        uint64 _functionSubscriptionId,
        uint32 _functionGasLimit,
        bytes32 _functionDonId
    )
        StoryBranchMinter(
            _functionRouter,
            _functionSubscriptionId,
            _functionGasLimit,
            _functionDonId
        )
    {}

    function startBranchContent(address _directory, bytes memory _name) public {
        // TODO: validate the content actualy exist using wormhole query
        _startBranchContent(_directory, _name, msg.sender);
    }

    // TODO: connect with L1
}
