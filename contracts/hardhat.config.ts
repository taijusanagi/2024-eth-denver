import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

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

task("view", "start story")
  .addParam("address", "Contract address")
  .addParam("index", "Content index")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const index = taskArgs.index;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const story = await contract.read.getStory([BigInt(index)]);
    console.log(story);
  });

task("start", "start story")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const tx = await contract.write.start();
    console.log(tx);
  });

task("interact", "interact with story")
  .addParam("address", "Contract address")
  .addParam("content", "Story content")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const content = taskArgs.content;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const tx = await contract.write.interact([content]);
    console.log(tx);
  });

export default config;
