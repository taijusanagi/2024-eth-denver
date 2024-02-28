// remapping does not work in my repo, so copied monimum from
// https://github.com/storyprotocol/protocol-core

// SPDX-License-Identifier: BUSL-1.1
pragma solidity 0.8.23;

library IP {
    struct MetadataV1 {
        string name;
        bytes32 hash;
        uint64 registrationDate;
        address registrant;
        string uri;
    }
}
