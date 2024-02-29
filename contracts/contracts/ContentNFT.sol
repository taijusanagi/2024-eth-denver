// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

// import "hardhat/console.sol";

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {ERC1155Holder} from "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

import {IERC5018} from "./eth-storage/IERC5018.sol";
import {IP} from "./story-protocol/IP.sol";
import {IIPAssetRegistry} from "./story-protocol/IIPAssetRegistry.sol";
import {ILicensingModule} from "./story-protocol/ILicensingModule.sol";

// TODO; add event
// TODO: add policy ID to mint input instead of contract
// TODO; add story protocol info in the minting event

contract ContentNFT is Ownable, ERC721, ERC1155Holder {
    enum ContentType {
        Root,
        Branch
    }

    // ETHStorage File Location
    struct RootContentLocation {
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
        address indexed ipId,
        address indexed creator,
        RootContentLocation rootContentLocation
    );
    event BranchContentMinted(
        uint256 indexed tokenId,
        address indexed ipId,
        address indexed creator,
        BranchContentLocatioin branchContentLocation
    );

    mapping(address => bool) public isbranchMinterL1;
    mapping(uint256 => ContentType) public contentTypes;
    mapping(uint256 => RootContentLocation) public rootContentLocations;
    mapping(uint256 => BranchContentLocatioin) public branchContentLocations;
    mapping(uint256 => address) public ipIds;
    mapping(uint256 => uint256) public licenseIds;

    address public ipAssetRegistry;
    address public ipResolver;
    address public licensingModule;
    uint256 public policyId;
    uint256 public totalSupply;

    constructor(
        string memory name,
        string memory symbol,
        address ipAssetRegistry_,
        address ipResolver_,
        address licensingModule_
    ) Ownable(msg.sender) ERC721(name, symbol) {
        ipAssetRegistry = ipAssetRegistry_;
        ipResolver = ipResolver_;
        licensingModule = licensingModule_;
    }

    function setBranchMinterL1(
        address branchMinterL1,
        bool status
    ) public onlyOwner {
        isbranchMinterL1[branchMinterL1] = status;
        emit branchMinterL1Set(branchMinterL1, status);
    }

    function mintRoot(
        address directory,
        bytes memory fileName,
        uint256 policyId,
        uint256 licenseAmount
    ) public {
        uint256 tokenId = totalSupply;
        totalSupply++;
        // should improve to check the content using ETHStorage better
        RootContentLocation memory rootContentLocation = RootContentLocation({
            directory: directory,
            name: fileName
        });
        contentTypes[tokenId] = ContentType.Root;
        rootContentLocations[tokenId] = rootContentLocation;

        // first mint nft to this address to enable IP registration
        _mint(address(this), tokenId);
        bytes memory metadata = abi.encode(
            IP.MetadataV1({
                name: "Interactive Story Root",
                hash: "",
                registrationDate: uint64(block.timestamp),
                registrant: address(this),
                uri: ""
            })
        );
        address ipId = IIPAssetRegistry(ipAssetRegistry).register(
            block.chainid,
            address(this),
            tokenId,
            ipResolver,
            true,
            metadata
        );
        ipIds[tokenId] = ipId;

        // then mint license to creator
        uint256 licenceId = ILicensingModule(licensingModule).mintLicense(
            policyId,
            ipId,
            licenseAmount,
            address(this),
            ""
        );
        licenseIds[tokenId] = licenceId;

        // then give the nft back to creator
        this.transferFrom(address(this), msg.sender, tokenId);

        emit RootContentMinted(tokenId, ipId, msg.sender, rootContentLocation);
    }

    function mintBranch(
        uint256 rootTokenId,
        uint256 chainId,
        address directory,
        uint256 index,
        address creator
    ) public {
        require(isbranchMinterL1[msg.sender], "ContentNFT: Invalid sender");
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
        _mint(address(this), tokenId);

        bytes memory metadata = abi.encode(
            IP.MetadataV1({
                name: "Interactive Story Branch",
                hash: "",
                registrationDate: uint64(block.timestamp),
                registrant: creator,
                uri: ""
            })
        );
        uint256 licenseId = licenseIds[rootTokenId];

        uint256[] memory licenseIds = new uint256[](1);
        licenseIds[0] = licenseId;
        address ipId = IIPAssetRegistry(ipAssetRegistry).register(
            licenseIds,
            bytes("0x"),
            block.chainid,
            address(this),
            tokenId,
            ipResolver,
            true,
            metadata
        );

        this.transferFrom(address(this), creator, tokenId);

        emit BranchContentMinted(tokenId, ipId, creator, branchContentLocation);
    }

    // ERC1155Holder is required to hold Story Protocol license
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC1155Holder) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /*
     * ETHStorage & Web3 URL implementation
     */
    function read(uint256 tokenId) public view returns (bytes memory) {
        RootContentLocation memory rootContentLocation = rootContentLocations[
            tokenId
        ];
        (bytes memory content, bool result) = IERC5018(
            rootContentLocation.directory
        ).read(rootContentLocation.name);
        if (!result) {
            return bytes("");
        } else {
            return content;
        }
    }
}
