import hre from "hardhat";
import { functionRouterAddress, functionDonId, functionGasLimit, functionSubscriptionId } from "../lib/chainlink";

async function main() {
  const baseStory = "hi how are you?";
  const storyGameNFT = await hre.viem.deployContract("StoryGameNFT" as string, [
    baseStory,
    functionRouterAddress,
    functionSubscriptionId,
    functionGasLimit,
    functionDonId,
  ]);
  console.log(`StoryGameNFT deployed to ${storyGameNFT.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
