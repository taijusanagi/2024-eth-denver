// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract MockAssetRegistry {
    function register(
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        address resolverAddr,
        bool createAccount,
        bytes calldata metadata_
    ) external returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(chainId, tokenContract, tokenId)
                        )
                    )
                )
            );
    }

    function register(
        uint256[] calldata licenseIds,
        bytes calldata royaltyContext,
        uint256 chainId,
        address tokenContract,
        uint256 tokenId,
        address resolverAddr,
        bool createAccount,
        bytes calldata metadata_
    ) external returns (address) {
        return
            address(
                uint160(
                    uint256(
                        keccak256(
                            abi.encodePacked(chainId, tokenContract, tokenId)
                        )
                    )
                )
            );
    }
}
