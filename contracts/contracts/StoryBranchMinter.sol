// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./libs/Content.sol";

abstract contract StoryBranchMinter is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;
    using Strings for address;

    enum Status {
        WaitingOracleResponse,
        WaitingUserInteraction,
        Ended
    }

    mapping(address => uint256) public activeBranchContentIds;
    mapping(uint256 => Status) public statuses;
    mapping(uint256 => RootContentLocatioin) public rootContentLocations;
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
        address _functionRouter,
        uint64 _functionSubscriptionId,
        uint32 _functionGasLimit,
        bytes32 _functionDonId
    ) FunctionsClient(_functionRouter) {
        subscriptionId = _functionSubscriptionId;
        functionGasLimit = _functionGasLimit;
        functionDonId = _functionDonId;
    }

    function _startBranchContent(
        address _directory,
        bytes memory _name,
        address _creator
    ) internal {
        require(
            activeBranchContentIds[_creator] == 0,
            "StoryBranchMinter: already have active branch content"
        );
        branchContentIndex++;
        uint256 _branchContentId = branchContentIndex;
        activeBranchContentIds[_creator] = _branchContentId;
        statuses[_branchContentId] = Status.WaitingOracleResponse;
        rootContentLocations[_branchContentId] = RootContentLocatioin({
            directory: _directory,
            name: _name
        });
        _sendRequestToChainlink(_branchContentId);
    }

    function interactFromCreator(bytes memory interaction) public {
        address _creator = msg.sender;
        require(
            activeBranchContentIds[_creator] != 0,
            "StoryBranchMinter: already have active branch content"
        );
        uint256 _branchContentId = activeBranchContentIds[_creator];
        require(
            statuses[_branchContentId] == Status.WaitingUserInteraction,
            "StoryBranchMinter: Invalid status"
        );
        statuses[_branchContentId] = Status.WaitingOracleResponse;
        _sendRequestToChainlink(_branchContentId);
    }

    function _processOracleRespond(
        uint256 _branchContentId,
        string memory _response
    ) internal {
        require(
            statuses[_branchContentId] == Status.WaitingOracleResponse,
            "StoryBranchMinter: Invalid status"
        );
        statuses[_branchContentId] = Status.WaitingUserInteraction;
        oracleResponses[_branchContentId].push(_response);
    }

    function _sendRequestToChainlink(uint256 _branchContentId) internal {
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(interactScript);
        string[] memory args = new string[](1);
        args[0] = block.chainid.toString();
        args[1] = _branchContentId.toString();
        req.setArgs(args);
        bytes32 _requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            functionGasLimit,
            functionDonId
        );
        functionRequestIdToBranchContentId[_requestId] = _branchContentId;
    }

    function fulfillRequest(
        bytes32 _requestId,
        bytes memory _response,
        bytes memory
    ) internal override {
        string memory _content = abi.decode(_response, (string));
        uint256 _branchContentId = functionRequestIdToBranchContentId[
            _requestId
        ];
        _processOracleRespond(_branchContentId, _content);
    }
}
