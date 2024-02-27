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
    const main = await hre.viem.deployContract("Main" as string, [
      baseStory,
      functionRouterAddress,
      functionSubscriptionId,
      functionGasLimit,
      functionDonId,
    ]);
    return {
      signer,
      main,
    };
  }

  describe("Deployment", function () {
    it("Should work", async function () {
      const { main } = await getFixture();
      expect(await main.read.baseStory()).to.equal(baseStory);
    });
  });

  return;

  describe("Start", function () {
    it("Should work", async function () {
      const { signer, main } = await getFixture();
      const [signerAddress] = await signer.getAddresses();
      const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
      const account = privateKeyToAccount(privateKey);
      const walletClient = await hre.viem.getWalletClient(signerAddress);
      const functionRouterContract = getContract({
        abi: functionRouterABI,
        address: functionRouterAddress,
        walletClient,
      });
      await functionRouterContract.write.addConsumer([functionSubscriptionId, main.address], { account });
      await main.write.start();
    });
  });
});
