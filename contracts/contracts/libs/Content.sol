// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

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
