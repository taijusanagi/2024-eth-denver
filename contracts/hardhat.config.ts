import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { script } from "./lib/chainlink";
// import "@nomicfoundation/hardhat-foundry";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.23",
  networks: {
    hardhat: {
      forking: {
        url: "https://gateway.tenderly.co/public/sepolia",
      },
    },
    sepolia: {
      url: "https://rpc.sepolia.ethpandaops.io",
      accounts,
    },
  },
  mocha: {
    timeout: 100000000,
  },
};

task("debugChainlinkFunctionsSendRequest", "start story")
  .addParam("address", "Contract address")
  .addParam("branchContentId", "Branch content id")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const branchContentId = taskArgs.branchContentId;
    const contract = await hre.viem.getContractAt("StoryBranchMinterL1Exposure", address);
    console.log(script);
    const tx = await contract.write.debugChainlinkFunctionsSendRequest([branchContentId, script]);
    console.log(tx);
  });

// task("start", "start story")
//   .addParam("address", "Contract address")
//   .setAction(async (taskArgs, hre) => {
//     const address = taskArgs.address;
//     const contract = await hre.viem.getContractAt("StoryGameNFT", address);
//     const tx = await contract.write.start();
//     console.log(tx);
//   });

// task("interact", "interact with story")
//   .addParam("address", "Contract address")
//   .addParam("content", "Story content")
//   .setAction(async (taskArgs, hre) => {
//     const address = taskArgs.address;
//     const content = taskArgs.content;
//     const contract = await hre.viem.getContractAt("StoryGameNFT", address);
//     const tx = await contract.write.interact([content]);
//     console.log(tx);
//   });

export default config;
