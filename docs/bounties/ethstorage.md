# ETHStorage Integration

Upload large prompt data into an EIP-4844 blob utilizing the ETHStorage SDK. Large on-chain storage is essential for the creation of interactive content. All smart contract data is configured for Web3URL, enabling efficient retrieval of dynamic on-chain game content.

## Detail

### Root Prompt

```
npx web3curl --web3-chain 11155111=http://65.108.236.27:9540/ web3://0x53e2e6379a5697f09c8eedd4fe05da4f9a977269:11155111/DarkFantasyTest-1709365218054.txt
```

- Upload and stored in blob with ETHStorage

https://github.com/taijusanagi/2024-eth-denver/blob/main/app/src/pages/api/upload.ts#L68

### Branch Content

```
npx web3curl web3://0x59961463a624e48120850f1937ba5c7ca3ef16fc:11155111/read/6
```

- Interactively reated on-chain

https://github.com/taijusanagi/2024-eth-denver/blob/main/contracts/contracts/StoryBranchMinter.sol#L164

### Chalenges

- Initially, grasping the functionality of ETHStorage proved challenging, requiring significant time to learn and experiment.
- Despite these obstacles, we gained a solid understanding of blob storage and Web3URL, leading to successful integration with our service.
