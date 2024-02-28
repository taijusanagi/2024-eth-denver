// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.23;

interface ILicensingModule {
    function mintLicense(
        uint256 policyId,
        address licensorIpId,
        uint256 amount,
        address receiver,
        bytes calldata royaltyContext
    ) external returns (uint256 licenseId);
}
