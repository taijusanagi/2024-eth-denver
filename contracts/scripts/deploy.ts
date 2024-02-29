import hre from "hardhat";
import { chainlinkConfig, script } from "../lib/chainlink";
import { nftName, nftSymbol } from "../lib/constants";
import { storyProtocolConfig } from "../lib/story-protocol";

async function main() {
  const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
    nftName,
    nftSymbol,
    storyProtocolConfig.sepolia.ipAssetRegistry,
    storyProtocolConfig.sepolia.ipResolver,
    storyProtocolConfig.sepolia.licensingModule,
  ]);
  // using contract with debug function
  const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
    chainlinkConfig.sepolia.functionsRouterAddress,
    chainlinkConfig.sepolia.functionsSubscriptionId,
    chainlinkConfig.sepolia.functionsGasLimit,
    chainlinkConfig.sepolia.functionsDonId,
    script,
    contentNFT.address,
  ]);
  console.log(`ContentNFT deployed to ${contentNFT.address}`);
  console.log(`StoryBranchMinterL1 deployed to ${storyBranchMinterL1.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
