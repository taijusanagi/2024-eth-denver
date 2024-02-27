// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MockFunctionsRouter {
    function sendRequest(
        uint64 subscriptionId,
        bytes calldata data,
        uint16 dataVersion,
        uint32 callbackGasLimit,
        bytes32 donId
    ) external returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    subscriptionId,
                    data,
                    dataVersion,
                    callbackGasLimit,
                    donId
                )
            );
    }
}
