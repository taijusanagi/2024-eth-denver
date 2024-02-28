import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  BranchContentMinted,
  OwnershipTransferred,
  RootContentMinted,
  Transfer,
  branchMinterL1Set
} from "../generated/Contract/Contract"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createBranchContentMintedEvent(
  tokenId: BigInt,
  creator: Address,
  branchContentLocation: ethereum.Tuple
): BranchContentMinted {
  let branchContentMintedEvent = changetype<BranchContentMinted>(newMockEvent())

  branchContentMintedEvent.parameters = new Array()

  branchContentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  branchContentMintedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  branchContentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "branchContentLocation",
      ethereum.Value.fromTuple(branchContentLocation)
    )
  )

  return branchContentMintedEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createRootContentMintedEvent(
  tokenId: BigInt,
  creator: Address,
  rootContentLocation: ethereum.Tuple
): RootContentMinted {
  let rootContentMintedEvent = changetype<RootContentMinted>(newMockEvent())

  rootContentMintedEvent.parameters = new Array()

  rootContentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )
  rootContentMintedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  rootContentMintedEvent.parameters.push(
    new ethereum.EventParam(
      "rootContentLocation",
      ethereum.Value.fromTuple(rootContentLocation)
    )
  )

  return rootContentMintedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createbranchMinterL1SetEvent(
  branchMinterL1: Address,
  status: boolean
): branchMinterL1Set {
  let branchMinterL1SetEvent = changetype<branchMinterL1Set>(newMockEvent())

  branchMinterL1SetEvent.parameters = new Array()

  branchMinterL1SetEvent.parameters.push(
    new ethereum.EventParam(
      "branchMinterL1",
      ethereum.Value.fromAddress(branchMinterL1)
    )
  )
  branchMinterL1SetEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return branchMinterL1SetEvent
}
