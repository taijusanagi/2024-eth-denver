# Story Protocol Integration

A custom smart contract interacts with Story Protocol's IP registration, licensing, and remix capabilities. User-created content becomes automatically trackable through Story Protocol, which could serve as the gateway to IP Finance (IPFi). This is a critical component of the incentive design for bottom-up IP creation and management.

## Detail

### Smart Contract Integration

https://github.com/taijusanagi/2024-eth-denver/blob/main/contracts/contracts/ContentNFT.sol

- Custom contract mints NFTs and registers them as intellectual property in a single transaction.
- The custom contract holds licenses, allowing other users to be granted permission.
- Other users can interact with the gaming NFTs and register them as subsidiary intellectual property.

### Mint Root IP Tx

https://sepolia.etherscan.io/tx/0xf7f3337eb8778b780fff80adf3853ea537068044a60360d0be9d17ff760ca7f1

- We can check license is minted for the child IP creation

### Mint Child IP Tx

https://sepolia.etherscan.io/tx/0x9193d777f8aebffd321a4c1f48b476d63bed2493a77deb0b8808e3218b6bb882

- We can check license is burned for the child IP creation

### Chalenges

- We attempted to integrate Story Protocol with our custom contract, which necessitated a significant learning effort.
- We implemented NFT registration and license management within the custom contract.
