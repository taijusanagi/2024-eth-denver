# Integration with Chainlink

Chainlink serves as a critical bridge, linking smart contracts with external data sources, including artificial intelligence systems. We leverage Chainlink's capabilities to facilitate our backend's access to, and aggregation of, historical gaming activities, while also enabling the generation of new content through the OpenAI API.

## Impact

This prototype demonstrates the integration of Chainlink Functions with AI models. Given the increasing demand for AI solutions, this initiative is likely to attract more users to the Chainlink ecosystem.

## Details

### Subscription Creation

https://functions.chain.link/sepolia/2020

- The following smart contract has been registered as a consumer.

### Smart Contract

https://github.com/taijusanagi/2024-eth-denver/blob/main/contracts/contracts/StoryBranchMinter.sol

- This contract captures user interactions, forwards them to Chainlink Functions, and manages responses received from Chainlink Functions.

### Backend Integration

https://github.com/taijusanagi/2024-eth-denver/blob/main/app/src/pages/api/ai.ts

- Retrieves data from the Ethereum Storage node.
- Collects user interactions and historical data from oracles.
- Procures new responses from ChatGPT and relays them back to the smart contract.

### Challenges

Integrating Chainlink Functions with the ChatGPT API and Ethereum storage presents certain challenges due to limitations such as response time and data size. This requires extensive debugging and optimization to ensure seamless operation.
