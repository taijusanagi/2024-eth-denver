// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.23;

contract MockLicensingModule {
    function mintLicense(
        uint256 policyId,
        address licensorIpId,
        uint256 amount,
        address receiver,
        bytes calldata royaltyContext
    ) external returns (uint256) {
        return 0;
    }
}
