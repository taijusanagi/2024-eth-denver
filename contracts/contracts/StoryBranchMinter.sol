// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

abstract contract StoryBranchMinter is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;
    using Strings for address;

    struct RootContentLocatioin {
        address directory;
        bytes name;
    }

    enum Status {
        WaitingOracleResponse,
        WaitingUserInteraction,
        Ended
    }

    mapping(address => uint256) public activeBranchContentIds;
    mapping(uint256 => uint256) public rootTokenIds;
    mapping(uint256 => Status) public statuses;
    mapping(uint256 => string[]) public oracleResponses;
    mapping(uint256 => string[]) public creatorInteractions;
    mapping(bytes32 => uint256) public functionRequestIdToBranchContentId;
    uint64 public subscriptionId;
    uint32 public functionGasLimit;
    bytes32 public functionDonId;
    string interactScript =
        "const chainId = args[0];"
        "const branchContentId = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://2024-eth-denver.vercel.app/openai`,"
        "params: {"
        "chainId,"
        "branchContentId,"
        "}"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.content);";
    uint256 public branchContentIndex;

    constructor(
        address functionRouter,
        uint64 functionSubscriptionId,
        uint32 functionGasLimit_,
        bytes32 functionDonId_
    ) FunctionsClient(functionRouter) {
        subscriptionId = functionSubscriptionId;
        functionGasLimit = functionGasLimit_;
        functionDonId = functionDonId_;
    }

    function _startBranchContent(
        uint256 rootContentTokenId,
        address creator
    ) internal {
        require(
            activeBranchContentIds[creator] == 0,
            "StoryBranchMinter: already have active branch content"
        );
        branchContentIndex++;
        uint256 branchContentId = branchContentIndex;
        activeBranchContentIds[creator] = branchContentId;
        statuses[branchContentId] = Status.WaitingOracleResponse;
        rootTokenIds[branchContentId] = rootContentTokenId;
        _sendRequestToChainlink(branchContentId);
    }

    function _endBranchContent(address creator) internal {
        require(
            activeBranchContentIds[creator] != 0,
            "StoryBranchMinter: no active branch content"
        );
        uint256 branchContentId = activeBranchContentIds[creator];
        require(
            statuses[branchContentId] == Status.WaitingUserInteraction,
            "StoryBranchMinter: Invalid status"
        );
        delete activeBranchContentIds[creator];
        statuses[branchContentId] = Status.Ended;
    }

    function interactFromCreator(string memory interaction) public {
        address creator = msg.sender;
        require(
            activeBranchContentIds[creator] != 0,
            "StoryBranchMinter: already have active branch content"
        );
        uint256 branchContentId = activeBranchContentIds[creator];
        require(
            statuses[branchContentId] == Status.WaitingUserInteraction,
            "StoryBranchMinter: Invalid status"
        );
        statuses[branchContentId] = Status.WaitingOracleResponse;
        creatorInteractions[branchContentId].push(interaction);
        _sendRequestToChainlink(branchContentId);
    }

    function _processOracleRespond(
        uint256 branchContentId,
        string memory response
    ) internal {
        require(
            statuses[branchContentId] == Status.WaitingOracleResponse,
            "StoryBranchMinter: Invalid status"
        );
        statuses[branchContentId] = Status.WaitingUserInteraction;
        oracleResponses[branchContentId].push(response);
    }

    function _sendRequestToChainlink(uint256 branchContentId) internal {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(interactScript);
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

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory
    ) internal override {
        string memory content = abi.decode(response, (string));
        uint256 branchContentId = functionRequestIdToBranchContentId[requestId];
        _processOracleRespond(branchContentId, content);
    }

    function getContent(
        uint256 contentId
    ) public view returns (uint256, string[] memory, string[] memory) {
        return (
            rootTokenIds[contentId],
            oracleResponses[contentId],
            creatorInteractions[contentId]
        );
    }

    function read(uint256 contentId) public view returns (string memory) {
        bytes memory result = abi.encodePacked(
            "Story Root ID: ",
            rootTokenIds[contentId].toString(),
            "\n"
        );
        for (uint256 i = 0; i < oracleResponses[contentId].length; i++) {
            result = abi.encodePacked(
                result,
                oracleResponses[contentId][i],
                "\n"
            );
            if (creatorInteractions[contentId].length > i) {
                result = abi.encodePacked(
                    result,
                    creatorInteractions[contentId][i],
                    "\n"
                );
            }
        }
        return string(result);
    }
}
