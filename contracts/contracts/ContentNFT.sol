// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ContentNFT is Ownable, ERC721 {
    enum ContentType {
        Root,
        Branch
    }

    // ETHStorage File Location
    struct RootContentLocatioin {
        address directory;
        bytes name;
    }

    struct BranchContentLocatioin {
        uint256 chainId;
        address branchMinterL1;
    }

    event branchMinterL1Set(address indexed branchMinterL1, bool status);
    event RootContentMinted(
        uint256 indexed tokenId,
        address indexed creator,
        RootContentLocatioin rootContentLocation
    );
    event BranchContentMinted(
        uint256 indexed tokenId,
        address indexed creator,
        BranchContentLocatioin branchContentLocation
    );
    mapping(address => bool) public isbranchMinterL1;
    mapping(uint256 => ContentType) public contentTypes;
    mapping(uint256 => RootContentLocatioin) public rootContentLocations;
    mapping(uint256 => BranchContentLocatioin) public branchContentLocations;
    uint256 public totalSupply;

    uint256 public totalStoryIndex;
    mapping(address => uint256) public ownStoryIndexes;

    constructor(
        string memory name,
        string memory symbol
    ) Ownable(msg.sender) ERC721(name, symbol) {}

    function setBranchMinterL1(
        address branchMinterL1,
        bool status
    ) external onlyOwner {
        isbranchMinterL1[branchMinterL1] = status;
        emit branchMinterL1Set(branchMinterL1, status);
    }

    function mintRoot(address directory, bytes memory fileName) external {
        uint256 tokenId = totalSupply;
        totalSupply++;
        // should improve to check the content using ETHStorage better
        RootContentLocatioin memory rootContentLocation = RootContentLocatioin({
            directory: directory,
            name: fileName
        });
        contentTypes[tokenId] = ContentType.Root;
        rootContentLocations[tokenId] = rootContentLocation;
        _mint(msg.sender, tokenId);
        emit RootContentMinted(tokenId, msg.sender, rootContentLocation);
    }

    function mintBranch(
        uint256 chainId,
        address branchMinterL1,
        address creator
    ) external {
        require(isbranchMinterL1[msg.sender], "ContentNFT: Invalid sender");
        uint256 tokenId = totalSupply;
        totalSupply++;
        BranchContentLocatioin
            memory branchContentLocation = BranchContentLocatioin({
                chainId: chainId,
                branchMinterL1: branchMinterL1
            });
        contentTypes[tokenId] = ContentType.Branch;
        branchContentLocations[tokenId] = branchContentLocation;
        _mint(msg.sender, tokenId);
        emit BranchContentMinted(tokenId, creator, branchContentLocation);
    }

    // function getStory(
    //     uint256 index
    // ) public view returns (string memory, string[] memory, string[] memory) {
    //     return (baseStory, responses[index], interactions[index]);
    // }

    // // this may cause error when too many story is created but ok for demo
    // function getAllStories()
    //     public
    //     view
    //     returns (string[] memory, string[][] memory, string[][] memory)
    // {
    //     string[] memory allBaseStories = new string[](totalStoryIndex);
    //     string[][] memory allResponses = new string[][](totalStoryIndex);
    //     string[][] memory allInteractions = new string[][](totalStoryIndex);
    //     for (uint256 i = 0; i <= totalStoryIndex; i++) {
    //         allBaseStories[i] = baseStory;
    //         allResponses[i] = responses[i];
    //         allInteractions[i] = interactions[i];
    //     }
    //     return (allBaseStories, allResponses, allInteractions);
    // }
}
