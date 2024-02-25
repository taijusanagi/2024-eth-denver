"use client";

import React, { useCallback, useEffect, useState } from "react";

import { Inter } from "next/font/google";

import {
  useRegisterRootIp,
  useMintLicense,
  useReadIpAssetRegistryIpId,
  useReadPolicy,
  useRegisterPolicy,
  useRegisterPILPolicy,
  // useIp
  useReadGetPolicyId,
  useAddPolicyToIp,
  useRegisterDerivativeIp,
} from "@story-protocol/react";
// import { Story } from "@story-protocol/core-sdk";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient, useWriteContract } from "wagmi";
import { zeroAddress } from "viem";
import { ethers } from "ethers";

// import e from "@story-protocol/core-sdk";

import {
  LicensingModuleAddress,
  licensingModuleABI,
  mockERC721Address,
  mockERC721ABI,
  encodeFrameworkData,
  typedDataToBytes,
  encodeRoyaltyContext,
  StoryAPIClient,
  computeRoyaltyContext,
  RoyaltyContext,
} from "@/lib/storyprotocol";

// e.LicenseClient.
console.log(ethers);

const provider = new ethers.JsonRpcProvider("https://rpc.sepolia.ethpandaops.io");

export default function CreatorPage() {
  useWalletClient();

  const client = useWalletClient();
  const { writeContract } = useWriteContract();

  const [mode, setMode] = useState<"createIp" | "combineIp" | "detail">("createIp");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdIpImage, setCreatedIpImage] = useState("https://placehold.jp/500x500.png");
  const [firstIpImage, setFirstIpImage] = useState("https://placehold.jp/500x500.png");
  const [secondIpImage, setSecondIpImage] = useState("https://placehold.jp/500x500.png");
  const [combinedIpImage, setCombinedIpImage] = useState("https://placehold.jp/500x500.png");
  const [detailIpImage, setDetailIpImage] = useState("https://placehold.jp/500x500.png");
  const [childIpImages, setChildIpImages] = useState([
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
  ]);

  const { address } = useAccount();
  const reigisterRootIp = useRegisterRootIp();
  const mintLicence = useMintLicense();
  const registerPolicy = useRegisterPILPolicy();
  const addPolicyToIp = useAddPolicyToIp();
  const registerDerivativeIp = useRegisterDerivativeIp();
  // ("");

  const [tokenId, setTokenId] = useState("143");
  const [isRegisteringIp, setIsRegisteringIp] = useState(false);
  const [registerIpTxHash, setRegisterIpTxHash] = useState("");
  const policyId = BigInt(10);
  const MOCK_NFT_ADDRESS = "0x5E28ab57D09C589ff5C7a2970d911178E97Eab81";
  const ipName = "";
  const contentHash = "0x0000000000000000000000000000000000000000000000000000000000000001";
  const royaltyContext = "0x";
  const externalURL = "";
  const ipId = "0xF6fcBdea94Eca2A12132b2033D7596e93F9ea78d";

  const royaltyPolicy = "0xda483fd6e6ecA1C2D913802F9a6B57a83b73029f";
  const royaltyToken = "0x1219A0E87e617E6560104fA11cfd4f01FeB47362";

  // const { data: pl } = useReadPolicy({
  //   args: [BigInt(11155111), BigInt(1)],
  // });
  // console.log("pl", pl);

  // const { data: licensorIpId } = useReadIpAssetRegistryIpId({
  //   args: [BigInt(11155111), MOCK_NFT_ADDRESS, BigInt(tokenId ?? 0)],
  // });

  // console.log("licensorIpId", licensorIpId);

  const handleRegisterIp = useCallback(async () => {
    console.log("handleRegisterIp");
    console.log(policyId, MOCK_NFT_ADDRESS, BigInt(tokenId), ipName, contentHash, externalURL);
    if (!address || !tokenId || isRegisteringIp) {
      return;
    }
    setIsRegisteringIp(true);
    try {
      const registerIpTxHash = await reigisterRootIp.writeContractAsync({
        functionName: "registerRootIp",
        args: [policyId, MOCK_NFT_ADDRESS, BigInt(tokenId), ipName, contentHash, externalURL],
      });
      setRegisterIpTxHash(registerIpTxHash);
    } catch (e) {
      console.error(e);
      setIsRegisteringIp(false);
    }
  }, [tokenId, isRegisteringIp, reigisterRootIp]);

  const policyParameters = {
    attribution: true, // Whether or not attribution is required when reproducing the work
    commercialUse: true, // Whether or not the work can be used commercially
    commercialAttribution: false, // Whether or not attribution is required when reproducing the work commercially
    commercializerChecker: zeroAddress, // commercializers that are allowed to commercially exploit the work. If zero address, then no restrictions is enforced
    commercializerCheckerData: "0x" as `0x${string}`, // Additional calldata for the commercializer checker
    commercialRevShare: 20, // Percentage of revenue that must be shared with the licensor
    derivativesAllowed: true, // Whether or not the licensee can create derivatives of his work
    derivativesAttribution: true, // Whether or not attribution is required for derivatives of the work
    derivativesApproval: false, // Whether or not the licensor must approve derivatives of the work before they can be linked to the licensor IP ID
    derivativesReciprocal: true, // Whether or not the licensee must license derivatives of the work under the same terms
    territories: ["USA", "CANADA"], // List of territories where the license is valid. If empty, global
    distributionChannels: [], // List of distribution channels where the license is valid. Empty if no restrictions.
    contentRestrictions: [], //
  };

  const registrationParams = {
    transferable: true, // Whether or not attribution is required when reproducing the work
    royaltyPolicy, // Address of a royalty policy contract that will handle royalty payments
    mintingFee: BigInt(0),
    mintingFeeToken: zeroAddress,
    policy: policyParameters,
  };

  // const types = ["uint256", "address"];
  // const values = [42, "0x0000000000000000000000000000000000000001"];
  // ethers.AbiCoder.defaultAbiCoder.

  // const test = useReadGetPolicyId({
  //   args: [
  //     BigInt(11155111),
  //     registrationParams.transferable,
  //     "0x50c3bcaa67d4ec3f285e4328451315ab0d9e539f",
  //     encodedPolicy,
  //     registrationParams.royaltyPolicy,
  //     encodedRev,
  //     registrationParams.mintingFee,
  //     registrationParams.mintingFeeToken,
  //   ],
  // });
  // console.log("test", test);
  const get = () => {
    const contract = new ethers.Contract(LicensingModuleAddress, licensingModuleABI, provider);
    contract
      .getPolicyId({
        isLicenseTransferable: registrationParams.transferable,
        policyFramework: "0x50c3bCAA67D4eC3f285E4328451315Ab0D9e539f",
        frameworkData: encodeFrameworkData(policyParameters),
        royaltyPolicy: registrationParams.royaltyPolicy,
        royaltyData: typedDataToBytes({
          interface: "uint32",
          data: [policyParameters.commercialRevShare],
        }),
        mintingFee: registrationParams.mintingFee,
        mintingFeeToken: registrationParams.mintingFeeToken,
      })
      .then((data) => {
        console.log("read");
        console.log(data);
      });
  };

  async function handleRegisterPolicy() {
    console.log("registrationParams");

    await registerPolicy.writeContractAsync({
      functionName: "registerPolicy",
      args: [registrationParams],
    });
  }

  function handleMintLicence() {
    console.log("handleMintLicence");
    if (!address) {
      return;
    }
    mintLicence.writeContractAsync({
      functionName: "mintLicense",
      args: [policyId, ipId, BigInt(1), address, royaltyContext],
    });
  }

  function handleAddPolicyToIp() {
    console.log("handleAddPolicyToIp");
    addPolicyToIp.writeContractAsync({
      functionName: "addPolicyToIp",
      args: [ipId, policyId],
    });
  }

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-violet-200 to-pink-200 font-poppins">
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={() => {
          console.log("mint");
          // const signer = client
          // const contract = new ethers.Contract(mockERC721Address, mockERC721ABI, client);
          writeContract({ abi: mockERC721ABI, address: mockERC721Address, functionName: "mint", args: [address] });
          // contract.mint(address);
        }}
      >
        Mint
      </button>
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={() => {
          get();
          handleRegisterPolicy();
        }}
      >
        Create Policy
      </button>
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={() => {
          const policyId = 11;
          const tokenId = 10;
          console.log("handleRegisterIp", policyId, tokenId);

          reigisterRootIp.writeContractAsync({
            // functionName: "registerRootIp",
            args: [policyId, mockERC721Address, BigInt(tokenId), ipName, contentHash, externalURL],
          });
        }}
      >
        Create Root IP
      </button>
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={async () => {
          const policyId = 11;
          // const tokenId = 7;
          const ipId = "0x87AF7B6f30f47E025906003e4e1F7Ac1793aD001";
          console.log("handleRegisterIp", policyId, ipId);
          const storyClient = new StoryAPIClient();
          const royaltyPolicy = await storyClient.getRoyaltyPolicy(ipId);
          console.log("royaltyPolicy", royaltyPolicy);

          const royaltyContext: RoyaltyContext = {
            targetAncestors: [],
            targetRoyaltyAmount: [],
            parentAncestors1: [],
            parentAncestors2: [],
            parentAncestorsRoyalties1: [],
            parentAncestorsRoyalties2: [],
          };

          if (royaltyPolicy) {
            royaltyContext.targetAncestors.push(...royaltyPolicy.targetAncestors);
            const targetRoyaltyAmount = royaltyPolicy.targetRoyaltyAmount.map((e) => parseInt(e));
            royaltyContext.targetRoyaltyAmount.push(...targetRoyaltyAmount);
          }

          console.log(royaltyContext);

          const encodedRoyaltyContext = encodeRoyaltyContext(royaltyContext);
          console.log(encodedRoyaltyContext);

          mintLicence.writeContractAsync({
            functionName: "mintLicense",
            args: [policyId, ipId, BigInt(1), address, encodedRoyaltyContext],
          });
        }}
      >
        Create License
      </button>
      <button
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        onClick={async () => {
          const policyId = 11;
          const tokenId = 12;
          console.log("handleRegisterIp", policyId, tokenId);

          const licenseIds = ["18"];
          const client = new StoryAPIClient();
          const royaltyContext = await computeRoyaltyContext(licenseIds, client);
          const encodedRoyaltyContext = encodeRoyaltyContext(royaltyContext);
          // console.log(royaltyContext);
          registerDerivativeIp.writeContractAsync({
            args: [
              licenseIds,
              mockERC721Address,
              BigInt(tokenId),
              ipName,
              contentHash,
              externalURL,
              encodedRoyaltyContext,
            ],
          });
        }}
      >
        Create Child IP
      </button>
      <header className="w-full py-4 bg-white backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold text-gray-800">Creator Tool</h1>
          <ConnectButton />
        </div>
      </header>
      <div className="flex flex-col justify-center items-center py-12 px-4">
        <div className="mb-4 flex justify-end items-center w-full max-w-xl">
          <nav className="flex space-x-4 text-white">
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "createIp" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("createIp")}
            >
              Create IP
            </button>
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "combineIp" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("combineIp")}
            >
              Combine IP
            </button>
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "detail" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("detail")}
            >
              Detail
            </button>
          </nav>
        </div>
        <div className="bg-white backdrop-blur-lg py-8 px-6 rounded-lg shadow-2xl w-full max-w-xl mx-auto space-y-6">
          {mode == "createIp" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create IP</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Prompt
                  </label>
                  <textarea
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  ></textarea>
                </div>
                <div>
                  <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => {
                      // get();
                      setIsModalOpen(true);
                    }}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
          {mode == "combineIp" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800  mb-4">Combine IP</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    First IP ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Second IP ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Combine
                  </button>
                </div>
              </div>
            </div>
          )}
          {mode == "detail" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800  mb-4">Detail</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    IP ID
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>
                <div>
                  <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            {mode == "createIp" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Preview</h3>
                </div>
                <div className="mt-2">
                  {createdIpImage && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Created IP</label>
                      <img src={createdIpImage} alt="Created IP Image" className="max-w-full h-auto rounded-md" />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => {
                      // handleRegisterIp();
                      // handleRegisterPolicy();
                      // setIsModalOpen(false);
                      // handleMintLicence();
                      // get();
                      // handleRegisterPILPolicy();
                      // handleAddPolicyToIp();
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}
            {mode == "combineIp" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Preview</h3>
                </div>
                <div className="mt-2 space-y-4">
                  <div className="flex space-x-4 justify-center items-center">
                    {firstIpImage && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original First IP</label>
                        <img src={firstIpImage} alt="First IP Image" className="w-full h-auto rounded-md shadow-sm" />
                      </div>
                    )}
                    {secondIpImage && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Original Second IP</label>
                        <img src={secondIpImage} alt="Second IP Image" className="w-full h-auto rounded-md shadow-sm" />
                      </div>
                    )}
                  </div>
                  {combinedIpImage && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Combined IP</label>
                      <img
                        src={combinedIpImage}
                        alt="Combined IP Image"
                        className="max-w-full h-auto rounded-md shadow-sm"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            )}

            {mode == "detail" && (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Detail</h3>
                </div>
                <div className="mt-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">IP</label>
                    <img
                      src={combinedIpImage}
                      alt="Combined IP Image"
                      className="max-w-full h-auto rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex space-x-4 justify-center items-center">
                    {firstIpImage && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent IP 1</label>
                        <img src={firstIpImage} alt="First IP Image" className="w-full h-auto rounded-md shadow-sm" />
                      </div>
                    )}
                    {secondIpImage && (
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Parent IP 2</label>
                        <img src={secondIpImage} alt="Second IP Image" className="w-full h-auto rounded-md shadow-sm" />
                      </div>
                    )}
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child IPs</label>
                    <div className="grid grid-cols-4 gap-4">
                      {childIpImages.map((image, index) => (
                        <div key={`child_ip_${index + 1}`} className="col-span-1">
                          <img
                            src={image}
                            alt={`Child IP ${index + 1}`}
                            className="w-full h-auto rounded-md shadow-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
