import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [];

const config: HardhatUserConfig = {
  solidity: "0.8.24",
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
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const base = await contract.read.baseStory();
    console.log(base);
  });

task("start", "start story")
  .addParam("address", "Contract address")
  .setAction(async (taskArgs, hre) => {
    const address = taskArgs.address;
    const contract = await hre.viem.getContractAt("StoryGameNFT", address);
    const tx = await contract.write.start();
    console.log(tx);
  });

export default config;
