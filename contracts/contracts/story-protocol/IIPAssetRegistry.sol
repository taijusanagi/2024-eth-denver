// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.23;

interface IIPAssetRegistry {
    function register(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        address resolverAddr,
        bool createAccount,
        bytes calldata metadata_
    ) external returns (address);
}
