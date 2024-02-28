import hre from "hardhat";
import { getContract, createWalletClient } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect } from "chai";
import { ethers } from "ethers";

import { chainlinkConfig } from "../lib/chainlink";
import { storyProtocolConfig } from "../lib/story-protocol";

import { nftName, nftSymbol, nullBytes32, nullBytes, nullAddress } from "../lib/constants";

describe("Integration", function () {
  it("Should work with mock", async function () {
    const [signer] = await hre.viem.getWalletClients();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const fileName = "fileName";
    const fileValue = "fileValue";
    mockFileDirectory.write.write([fileName, fileValue]);
    const mockAssetRegistry = await hre.viem.deployContract("MockAssetRegistry" as string, []);
    const mockLicensingModule = await hre.viem.deployContract("MockLicensingModule" as string, []);
    const mockFunctionsRouter = await hre.viem.deployContract("MockFunctionsRouter" as string, []);
    const policyId = 1;
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
      nftName,
      nftSymbol,
      mockAssetRegistry.address,
      nullAddress,
      mockLicensingModule.address,
      policyId,
    ]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      mockFunctionsRouter.address,
      0,
      0,
      nullBytes32,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    const [signerAddress] = await signer.getAddresses();
    const licenceAmount = 1;
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      licenceAmount,
    ]);
    const rootTokenId = 0;
    expect(await contentNFT.read.ownerOf([rootTokenId])).to.equal(signerAddress);
    await storyBranchMinterL1.write.startBranchContent([rootTokenId]);
    const contentId = await storyBranchMinterL1.read.activeBranchContentIds([signerAddress]);
    const oracleRespond1 = "oracleResponse1";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond1]);
    const userInteract1 = "userInteraction1";
    await storyBranchMinterL1.write.interactFromCreator([userInteract1]);
    const oracleRespond2 = "oracleResponse2";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond2]);
    await storyBranchMinterL1.write.endBranchContent();
    const branchTokenId = 1;
    expect(await contentNFT.read.ownerOf([branchTokenId])).to.equal(signerAddress);

    // check views
    // const content = await storyBranchMinterL1.read.getContent([contentId]);
    // console.log(content);
    // const read = await storyBranchMinterL1.read.read([contentId]);
    // console.log(read);
  });

  it("Should work with forked story protocol", async function () {
    const [signer] = await hre.viem.getWalletClients();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const fileName = "fileName";
    const fileValue = "fileValue";
    mockFileDirectory.write.write([fileName, fileValue]);
    const mockFunctionsRouter = await hre.viem.deployContract("MockFunctionsRouter" as string, []);
    const policyId = 1;
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
      nftName,
      nftSymbol,
      storyProtocolConfig.sepolia.ipAssetRegistry,
      nullAddress,
      storyProtocolConfig.sepolia.licensingModule,
      policyId,
    ]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      mockFunctionsRouter.address,
      0,
      0,
      nullBytes32,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    const [signerAddress] = await signer.getAddresses();
    const licenceAmount = 10;
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      licenceAmount,
    ]);
    const rootTokenId = 0;
    expect(await contentNFT.read.ownerOf([rootTokenId])).to.equal(signerAddress);
    await storyBranchMinterL1.write.startBranchContent([rootTokenId]);
    const contentId = await storyBranchMinterL1.read.activeBranchContentIds([signerAddress]);
    const oracleRespond1 = "oracleResponse1";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond1]);
    const userInteract1 = "userInteraction1";
    await storyBranchMinterL1.write.interactFromCreator([userInteract1]);
    const oracleRespond2 = "oracleResponse2";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond2]);
    await storyBranchMinterL1.write.endBranchContent();
    const branchTokenId = 1;
    expect(await contentNFT.read.ownerOf([branchTokenId])).to.equal(signerAddress);

    // check views
    // const content = await storyBranchMinterL1.read.getContent([contentId]);
    // console.log(content);
    // const read = await storyBranchMinterL1.read.read([contentId]);
    // console.log(read);
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
