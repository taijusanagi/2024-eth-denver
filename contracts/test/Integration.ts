import hre from "hardhat";
import { getContract, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect } from "chai";

import { chainlinkConfig } from "../lib/chainlink";

import { nftName, nftSymbol, nullBytes32, nullBytes } from "../lib/constants";

describe("Integration", function () {
  const baseStory = "hi how are you?";
  async function getFixture() {
    const [signer] = await hre.viem.getWalletClients();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const mockFunctionsRouter = await hre.viem.deployContract("MockFunctionsRouter" as string, []);
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [nftName, nftSymbol]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      mockFunctionsRouter.address,
      0,
      0,
      nullBytes32,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    return {
      signer,
      mockFileDirectory,
      contentNFT,
      storyBranchMinterL1,
    };
  }

  describe("Deployment", function () {
    it("Should work", async function () {
      const { contentNFT } = await getFixture();
      expect(await contentNFT.read.name()).to.equal(nftName);
      expect(await contentNFT.read.symbol()).to.equal(nftSymbol);
    });
  });

  describe("Integration L1", function () {
    it("Should work", async function () {
      const { signer, mockFileDirectory, contentNFT, storyBranchMinterL1 } = await getFixture();
      const [signerAddress] = await signer.getAddresses();
      const key = nullBytes;
      await contentNFT.write.mintRoot([mockFileDirectory.address, key]);
      const rootTokenId = 0;
      expect(await contentNFT.read.ownerOf([rootTokenId])).to.equal(signerAddress);
      await storyBranchMinterL1.write.startBranchContent([rootTokenId]);
      const contentId = await storyBranchMinterL1.read.activeBranchContentIds([signerAddress]);
      const oracleRespond1 = "oracleRespond1";
      await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond1]);
      const userInteract1 = "userInteract1";
      await storyBranchMinterL1.write.interactFromCreator([userInteract1]);
      const oracleRespond2 = "oracleRespond2";
      await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond2]);
      await storyBranchMinterL1.write.endBranchContent();
      const branchTokenId = 1;
      expect(await contentNFT.read.ownerOf([branchTokenId])).to.equal(signerAddress);

      // contentNFT.write.mintRoot();
      // await contentNFT.write.
    });
  });

  // describe("Start", function () {
  //   it("Should work", async function () {
  //     const { signer, main } = await getFixture();
  //     const [signerAddress] = await signer.getAddresses();
  //     const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  //     const account = privateKeyToAccount(privateKey);
  //     const walletClient = await hre.viem.getWalletClient(signerAddress);
  //     const functionRouterContract = getContract({
  //       abi: functionRouterABI,
  //       address: functionRouterAddress,
  //       walletClient,
  //     });
  //     await functionRouterContract.write.addConsumer([functionSubscriptionId, main.address], { account });
  //     await main.write.start();
  //   });
  // });
});
