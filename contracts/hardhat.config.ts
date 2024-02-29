import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
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
};

task("debugChainlinkFunctionsSendRequest", "start story")
  .addParam("address", "Contract address")
  .addParam("branchContentId", "Branch content id")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const branchContentId = taskArgs.branchContentId;
    const contract = await hre.viem.getContractAt("StoryBranchMinterL1Exposure", address);
    const script = `
      const chainId = args[0];
      const branchContentId = args[1];
      const apiResponse = await Functions.makeHttpRequest({
      url: 'https://2024-eth-denver.vercel.app/api/ai',
      params: {
      chainId,
      branchContentId,
      }
      });
      if (apiResponse.error) {
      throw Error('Request failed');
      }
      const { data } = apiResponse;
      return Functions.encodeString(data.content);
    `;
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
