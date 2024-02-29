// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import "../../StoryBranchMinterL1.sol";

contract StoryBranchMinterL1Exposure is StoryBranchMinterL1 {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;

    constructor(
        address functionRouter,
        uint64 functionSubscriptionId,
        uint32 functionGasLimit,
        bytes32 functionDonId,
        string memory interactScript,
        ContentNFT contentNFT
    )
        StoryBranchMinterL1(
            functionRouter,
            functionSubscriptionId,
            functionGasLimit,
            functionDonId,
            interactScript,
            contentNFT
        )
    {}

    function exposeProcessOracleRespond(
        uint256 _branchContentId,
        string memory _response
    ) public {
        _processOracleRespond(_branchContentId, _response);
    }

    function debugChainlinkFunctionsSendRequest(
        uint256 branchContentId,
        string memory overrideScript
    ) public {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(overrideScript);
        string[] memory args = new string[](2);
        args[0] = block.chainid.toString();
        args[1] = branchContentId.toString();
        req.setArgs(args);
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            functionGasLimit,
            functionDonId
        );
        functionRequestIdToBranchContentId[requestId] = branchContentId;
    }
}
