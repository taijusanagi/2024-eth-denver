import hre from "hardhat";
import { functionRouterAddress, functionDonId, functionGasLimit, functionSubscriptionId } from "../lib/chainlink";

async function main() {
  const baseStory = "hi how are you?";
  const main = await hre.viem.deployContract("Main" as string, [
    baseStory,
    functionRouterAddress,
    functionSubscriptionId,
    functionGasLimit,
    functionDonId,
  ]);
  console.log(`Main deployed to ${main.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
