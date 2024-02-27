// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import "./libs/Content.sol";
import "./StoryBranchMinter.sol";
import "./ContentNFT.sol";

contract StoryBranchMinterL2 {
    function startBranchContent(address _directory, bytes memory _name) public {
        // TODO: validate the content actualy exist using wormhole query
        _startBranchContent(_directory, _name, msg.sender);
    }

    // TODO: connect with L1
}
