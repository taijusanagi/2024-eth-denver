// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IP} from "@story-protocol/contracts/contracts/lib/IP.sol";
import {IPAssetRegistry} from "@story-protocol/contracts/contracts/registries/IPAssetRegistry.sol";
import {IPResolver} from "@story-protocol/contracts/contracts/resolvers/IPResolver.sol";
// import {ILicensingModule} from "@storyprotocol/contracts/contracts/interfaces/modules/licensing/ILicensingModule.sol";
// import {StoryProtocolGateway} from "solidity-template/contracts/StoryProtocolGateway.sol";

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
        address directory;
        uint256 index;
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
    mapping(uint256 => address) public ipIds;

    IPAssetRegistry public ipAssetRegistry;
    IPResolver public ipResolver;
    // StoryProtocolGateway immutable spg;
    uint256 public totalSupply;

    // StoryProtocolGateway spg_
    constructor(
        string memory name,
        string memory symbol,
        IPAssetRegistry ipAssetRegistry_,
        IPResolver ipResolver_
    ) Ownable(msg.sender) ERC721(name, symbol) {
        ipAssetRegistry = ipAssetRegistry_;
        ipResolver = ipResolver_;
        // spg = spg_;
    }

    function setBranchMinterL1(
        address branchMinterL1,
        bool status
    ) public onlyOwner {
        isbranchMinterL1[branchMinterL1] = status;
        emit branchMinterL1Set(branchMinterL1, status);
    }

    function mintRoot(address directory, bytes memory fileName) public {
        uint256 tokenId = totalSupply;
        totalSupply++;
        // should improve to check the content using ETHStorage better
        RootContentLocatioin memory rootContentLocation = RootContentLocatioin({
            directory: directory,
            name: fileName
        });
        contentTypes[tokenId] = ContentType.Root;
        rootContentLocations[tokenId] = rootContentLocation;

        // first mint nft to this address to enable IP registration
        _mint(address(this), tokenId);
        bytes memory metadata = abi.encode(
            IP.MetadataV1({
                name: "Interactive Story Root:",
                hash: "",
                registrationDate: uint64(block.timestamp),
                registrant: address(this),
                uri: ""
            })
        );
        address ipId = ipAssetRegistry.register(
            block.chainid,
            address(this),
            tokenId,
            address(ipResolver),
            true,
            metadata
        );
        // then give the nft back to creator
        this.transferFrom(address(this), msg.sender, tokenId);
        emit RootContentMinted(tokenId, msg.sender, rootContentLocation);
    }

    function mintBranch(
        uint256 chainId,
        address directory,
        uint256 index,
        address creator
    ) public {
        require(isbranchMinterL1[msg.sender], "ContentNFT: Invalid sender");
        // PILPolicy memory pilPolicy;
        // address licensorIpId;
        // spg.mintLicensePIL(
        //     pilPolicy,
        //     licensorIpId,
        //     1,
        //     ROYATY_CONTEXT,
        //     MINTING_FEE,
        //     MINTING_FEE_TOKNE
        // );

        uint256 tokenId = totalSupply;
        totalSupply++;
        BranchContentLocatioin
            memory branchContentLocation = BranchContentLocatioin({
                chainId: chainId,
                directory: directory,
                index: index
            });
        contentTypes[tokenId] = ContentType.Branch;
        branchContentLocations[tokenId] = branchContentLocation;
        _mint(creator, tokenId);
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
