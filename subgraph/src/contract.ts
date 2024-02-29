import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  BranchContentMinted as BranchContentMintedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  RootContentMinted as RootContentMintedEvent,
  Transfer as TransferEvent,
  branchMinterL1Set as branchMinterL1SetEvent
} from "../generated/Contract/Contract"
import {
  Approval,
  ApprovalForAll,
  BranchContentMinted,
  OwnershipTransferred,
  RootContentMinted,
  Transfer,
  branchMinterL1Set
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleBranchContentMinted(
  event: BranchContentMintedEvent
): void {
  let entity = new BranchContentMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.ipId = event.params.ipId
  entity.creator = event.params.creator
  entity.branchContentLocation_chainId =
    event.params.branchContentLocation.chainId
  entity.branchContentLocation_directory =
    event.params.branchContentLocation.directory
  entity.branchContentLocation_index = event.params.branchContentLocation.index

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleRootContentMinted(event: RootContentMintedEvent): void {
  let entity = new RootContentMinted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.tokenId = event.params.tokenId
  entity.ipId = event.params.ipId
  entity.creator = event.params.creator
  entity.rootContentLocation_directory =
    event.params.rootContentLocation.directory
  entity.rootContentLocation_name = event.params.rootContentLocation.name

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlebranchMinterL1Set(event: branchMinterL1SetEvent): void {
  let entity = new branchMinterL1Set(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.branchMinterL1 = event.params.branchMinterL1
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
