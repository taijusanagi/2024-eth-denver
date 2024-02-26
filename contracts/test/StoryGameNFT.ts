import hre from "hardhat";
import { getContract, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect } from "chai";

import {
  functionRouterAddress,
  functionRouterABI,
  functionSubscriptionId,
  functionGasLimit,
  functionDonId,
} from "../lib/chainlink";

describe("Dungeon", function () {
  const baseStory = "hi how are you?";
  async function getFixture() {
    const [signer] = await hre.viem.getWalletClients();
    const storyGameNFT = await hre.viem.deployContract("StoryGameNFT" as string, [
      baseStory,
      functionRouterAddress,
      functionSubscriptionId,
      functionGasLimit,
      functionDonId,
    ]);
    return {
      signer,
      storyGameNFT,
    };
  }

  describe("Deployment", function () {
    it("Should work", async function () {
      const { storyGameNFT } = await getFixture();
      expect(await storyGameNFT.read.baseStory()).to.equal(baseStory);
    });
  });

  return;

  describe("Start", function () {
    it("Should work", async function () {
      const { signer, storyGameNFT } = await getFixture();
      const [signerAddress] = await signer.getAddresses();
      const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
      const account = privateKeyToAccount(privateKey);
      const walletClient = await hre.viem.getWalletClient(signerAddress);
      const functionRouterContract = getContract({
        abi: functionRouterABI,
        address: functionRouterAddress,
        walletClient,
      });
      await functionRouterContract.write.addConsumer([functionSubscriptionId, storyGameNFT.address], { account });
      await storyGameNFT.write.start();
    });
  });
});
