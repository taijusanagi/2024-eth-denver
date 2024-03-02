import hre from "hardhat";
import { getContract } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { expect } from "chai";
import { ethers } from "ethers";

import { chainlinkConfig, functionRouterABI, script } from "../lib/chainlink";
import { storyProtocolConfig } from "../lib/story-protocol";

import { nftName, nftSymbol, nullBytes32, nullAddress } from "../lib/constants";
import axios from "axios";
import {
  EthCallData,
  EthCallQueryRequest,
  PerChainQueryRequest,
  QueryProxyMock,
  QueryRequest,
  signaturesToEvmStruct,
} from "@wormhole-foundation/wormhole-query-sdk";
import { wormholeSepoliaChainId, wormholeSepoliaContractAddress } from "../lib/wormhole";

describe("Integration", function () {
  it("Should work with mock", async function () {
    const [signer] = await hre.viem.getWalletClients();
    const [signerAddress] = await signer.getAddresses();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const fileName = "fileName";
    const fileValue = "fileValue";
    mockFileDirectory.write.write([fileName, fileValue]);
    const mockAssetRegistry = await hre.viem.deployContract("MockAssetRegistry" as string, []);
    const mockLicensingModule = await hre.viem.deployContract("MockLicensingModule" as string, []);
    const mockFunctionsRouter = await hre.viem.deployContract("MockFunctionsRouter" as string, []);
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
      nftName,
      nftSymbol,
      mockAssetRegistry.address,
      nullAddress,
      mockLicensingModule.address,
    ]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      mockFunctionsRouter.address,
      0,
      0,
      nullBytes32,
      script,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    const policyId = 1;
    const licenceAmount = 1;
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      policyId,
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
    const [signerAddress] = await signer.getAddresses();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const fileName = "fileName";
    const fileValue = "fileValue";
    mockFileDirectory.write.write([fileName, fileValue]);
    const mockFunctionsRouter = await hre.viem.deployContract("MockFunctionsRouter" as string, []);
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
      nftName,
      nftSymbol,
      storyProtocolConfig.sepolia.ipAssetRegistry,
      storyProtocolConfig.sepolia.ipResolver,
      storyProtocolConfig.sepolia.licensingModule,
    ]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      mockFunctionsRouter.address,
      0,
      0,
      nullBytes32,
      script,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    const policyId = 1;
    const licenceAmount = 10;
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      policyId,
      licenceAmount,
    ]);
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      policyId,
      licenceAmount,
    ]);
    const rootTokenId = 1;
    expect(await contentNFT.read.ownerOf([rootTokenId])).to.equal(signerAddress);
    await storyBranchMinterL1.write.startBranchContent([rootTokenId]);
    const contentId = await storyBranchMinterL1.read.activeBranchContentIds([signerAddress]);
    expect(await storyBranchMinterL1.read.rootTokenIds([contentId])).to.equal(BigInt(rootTokenId));
    const oracleRespond1 = "oracleResponse1";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond1]);
    const userInteract1 = "userInteraction1";
    await storyBranchMinterL1.write.interactFromCreator([userInteract1]);
    const oracleRespond2 = "oracleResponse2";
    await storyBranchMinterL1.write.exposeProcessOracleRespond([contentId, oracleRespond2]);
    await storyBranchMinterL1.write.endBranchContent();
    const branchTokenId = 1;
    expect(await contentNFT.read.ownerOf([branchTokenId])).to.equal(signerAddress);
  });

  // chainlink integration needs more setup, so we will skip it default
  it("Should work forked chainlink functions", async function () {
    const [signer] = await hre.viem.getWalletClients();
    const [signerAddress] = await signer.getAddresses();
    const mockFileDirectory = await hre.viem.deployContract("MockFileDirectory" as string, []);
    const fileName = "fileName";
    const fileValue = "fileValue";
    mockFileDirectory.write.write([fileName, fileValue]);
    const mockAssetRegistry = await hre.viem.deployContract("MockAssetRegistry" as string, []);
    const mockLicensingModule = await hre.viem.deployContract("MockLicensingModule" as string, []);
    const contentNFT = await hre.viem.deployContract("ContentNFT" as string, [
      nftName,
      nftSymbol,
      mockAssetRegistry.address,
      nullAddress,
      mockLicensingModule.address,
    ]);
    const storyBranchMinterL1 = await hre.viem.deployContract("StoryBranchMinterL1Exposure" as string, [
      chainlinkConfig.sepolia.functionsRouterAddress,
      chainlinkConfig.sepolia.functionsSubscriptionId,
      chainlinkConfig.sepolia.functionsGasLimit,
      chainlinkConfig.sepolia.functionsDonId,
      script,
      contentNFT.address,
    ]);
    await contentNFT.write.setBranchMinterL1([storyBranchMinterL1.address, true]);
    const policyId = 1;
    const licenceAmount = 1;
    await contentNFT.write.mintRoot([
      mockFileDirectory.address,
      ethers.utils.hexlify(ethers.utils.toUtf8Bytes(fileName)),
      policyId,
      licenceAmount,
    ]);
    const rootTokenId = 0;
    expect(await contentNFT.read.ownerOf([rootTokenId])).to.equal(signerAddress);

    // functions setup
    // this account must be subscription owner
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    const account = privateKeyToAccount(privateKey);
    const walletClient = await hre.viem.getWalletClient(signerAddress);
    const functionRouterContract = getContract({
      abi: functionRouterABI,
      address: chainlinkConfig.sepolia.functionsRouterAddress as `0x${string}`,
      walletClient,
    });
    // this subscriptioin should have enough LINK token
    await functionRouterContract.write.addConsumer(
      [chainlinkConfig.sepolia.functionsSubscriptionId, storyBranchMinterL1.address],
      {
        account,
      },
    );
    // this function calls chainlink functions send request
    await storyBranchMinterL1.write.startBranchContent([rootTokenId]);
    // not testing the oracle callback part here
  });

  it.skip("Should work with wormhole query", async function () {
    const [signer] = await hre.viem.getWalletClients();
    const [signerAddress] = await signer.getAddresses();
    const contract = await hre.viem.deployContract("QueryDemo", [
      signerAddress,
      wormholeSepoliaContractAddress,
      wormholeSepoliaChainId,
    ]);
    const rpc = "https://ethereum.publicnode.com";
    const latestBlock: string = (
      await axios.post(rpc, {
        method: "eth_getBlockByNumber",
        params: ["latest", false],
        id: 1,
        jsonrpc: "2.0",
      })
    ).data?.result?.number;
    // console.log("latestBlock", latestBlock);
    const callData: EthCallData = {
      to: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
      data: "0x18160ddd", // web3.eth.abi.encodeFunctionSignature("totalSupply()")
    };
    const request = new QueryRequest(
      0, // nonce
      [
        new PerChainQueryRequest(
          2, // Ethereum Wormhole Chain ID
          new EthCallQueryRequest(latestBlock, [callData]),
        ),
      ],
    );
    const mock = new QueryProxyMock({ 2: rpc });
    const mockData: any = await mock.mock(request);
    console.log(signaturesToEvmStruct(mockData.signatures));
    console.log(mockData.bytes);
    await contract.write.updateCounters([`0x${mockData.bytes}`, signaturesToEvmStruct(mockData.signatures) as any]);
    // console.log(mockData);
    // contract.
  });
});
