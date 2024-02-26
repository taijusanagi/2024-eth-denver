// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// import "hardhat/console.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

import "./StoryLogNFT.sol";

contract StoryGameNFT is FunctionsClient {
    using FunctionsRequest for FunctionsRequest.Request;
    using Strings for uint256;
    using Strings for address;

    string public baseStory;
    uint256 public totalStoryIndex;
    mapping(address => uint256) public ownStoryIndexes;
    mapping(uint256 => string[]) public responses;
    mapping(uint256 => string[]) public interactions;
    mapping(uint256 => bool) public isWaitingResponse;
    mapping(bytes32 => address) public functionRequestSender;
    uint64 public subscriptionId;
    uint32 public functionGasLimit;
    bytes32 public functionDonId;
    string interactScript =
        "const chainId = args[0];"
        "const address = args[1];"
        "const index = args[2];"
        "const content = args[3];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://2024-eth-denver.vercel.app/api`,"
        "params: {"
        "chainId,"
        "address,"
        "index,"
        "content"
        "}"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.ok);";

    constructor(
        string memory _baseStory,
        address _functionRouter,
        uint64 _functionSubscriptionId,
        uint32 _functionGasLimit,
        bytes32 _functionDonId
    ) FunctionsClient(_functionRouter) {
        baseStory = _baseStory;
        subscriptionId = _functionSubscriptionId;
        functionGasLimit = _functionGasLimit;
        functionDonId = _functionDonId;
    }

    function start() public {
        require(ownStoryIndexes[msg.sender] == 0, "invalid");
        totalStoryIndex++;
        isWaitingResponse[totalStoryIndex] = true;
        ownStoryIndexes[msg.sender] = totalStoryIndex;
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(interactScript);
        string[] memory args = new string[](4);
        args[0] = block.chainid.toString();
        args[1] = address(this).toHexString();
        args[2] = totalStoryIndex.toString();
        args[3] = baseStory;
        req.setArgs(args);
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            functionGasLimit,
            functionDonId
        );
        functionRequestSender[requestId] = msg.sender;
    }

    function end() public {
        require(ownStoryIndexes[msg.sender] != 0, "invalid");
        delete ownStoryIndexes[msg.sender];

        // publish in story protocol
    }

    function interact(string memory _interaction) public {
        uint256 ownStoryIndex = ownStoryIndexes[msg.sender];
        require(!isWaitingResponse[ownStoryIndex], "invalid");
        isWaitingResponse[ownStoryIndex] = true;
        interactions[ownStoryIndex].push(_interaction);
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(interactScript);
        string[] memory args = new string[](4);
        args[0] = block.chainid.toString();
        args[1] = address(this).toHexString();
        args[2] = totalStoryIndex.toString();
        args[3] = baseStory;
        req.setArgs(args);
        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            functionGasLimit,
            functionDonId
        );
        functionRequestSender[requestId] = msg.sender;
    }

    function respond(address _sender, string memory _response) internal {
        uint256 ownStoryIndex = ownStoryIndexes[_sender];
        require(isWaitingResponse[ownStoryIndex], "invalid");
        isWaitingResponse[ownStoryIndex] = true;
        responses[ownStoryIndex].push(_response);
    }

    function fulfillRequest(
        bytes32 _requestId,
        bytes memory _response,
        bytes memory
    ) internal override {
        address sender = functionRequestSender[_requestId];
        respond(sender, string(_response));
    }

    function getStory(
        uint256 index
    ) public view returns (string memory, string[] memory, string[] memory) {
        return (baseStory, responses[index], interactions[index]);
    }

    // this may cause error when too many story is created but ok for demo
    function getAllStories()
        public
        view
        returns (string[] memory, string[][] memory, string[][] memory)
    {
        string[] memory allBaseStories = new string[](totalStoryIndex);
        string[][] memory allResponses = new string[][](totalStoryIndex);
        string[][] memory allInteractions = new string[][](totalStoryIndex);
        for (uint256 i = 0; i < totalStoryIndex; i++) {
            allBaseStories[i] = baseStory;
            allResponses[i] = responses[i];
            allInteractions[i] = interactions[i];
        }
        return (allBaseStories, allResponses, allInteractions);
    }
}
