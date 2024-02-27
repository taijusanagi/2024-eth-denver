// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

import "..//StoryBranchMinterL1.sol";

contract StoryBranchMinterL1Exposure is StoryBranchMinterL1 {
    constructor(
        address _functionRouter,
        uint64 _functionSubscriptionId,
        uint32 _functionGasLimit,
        bytes32 _functionDonId,
        ContentNFT _contentNFT
    )
        StoryBranchMinterL1(
            _functionRouter,
            _functionSubscriptionId,
            _functionGasLimit,
            _functionDonId,
            _contentNFT
        )
    {}

    function exposeProcessOracleRespond(
        uint256 _branchContentId,
        string memory _response
    ) public {
        _processOracleRespond(_branchContentId, _response);
    }
}
