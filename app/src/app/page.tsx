"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { MdArrowBackIos } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import Markdown from "react-markdown";
// import { AiOutlineLoading } from "react-isons/";

import { useAccount } from "wagmi";
import { useQuery, gql } from "@apollo/client";

import { useEthersSigner } from "@/lib/ethers";
import { ethers } from "ethers";
import { useIsConnected } from "@/hooks/useIsConnected";
import {
  contentNFTAbi,
  contentNFTAddress,
  sepoliaEthereumStorageNodeRPC,
  storyBranchMinterL1Abi,
  storyBranchMinterL1Address,
} from "@/lib/contracts";
import { mockRootNFTs } from "@/lib/mock";
import { IERC5018Abi } from "@/lib/ethstorage";

// content name is modified in backend like ${name}-1709156261098.txt
// so this can be removed in frontend for better display
const namePostfixLength = 18;
const defaultPolicyId = 1;
const defaultLicenseAmount = 100;
const spriteDuration = 2000;

const ROOT_QUERY = gql`
  query {
    rootContentMinteds(orderBy: tokenId, orderDirection: desc) {
      tokenId
      ipId
      creator
      rootContentLocation_directory
      rootContentLocation_name
    }
  }
`;

const BRANCH_QUERY = gql`
  query {
    branchContentMinteds(orderBy: tokenId, orderDirection: desc) {
      rootTokenId
      tokenId
      ipId
      creator
      branchContentLocation_chainId
      branchContentLocation_directory
      branchContentLocation_index
    }
  }
`;

export default function CreatorPage() {
  const { address: connectedAddress } = useAccount();
  const signer = useEthersSigner();
  const { openConnectModal } = useConnectModal();

  const { loading: rootQueryLoading, data: rootQueryResult } = useQuery(ROOT_QUERY);
  const { loading: branchQueryLoading, data: branchQueryResult } = useQuery(BRANCH_QUERY);
  const { isConnected } = useIsConnected();

  const [spriteMode, setSpriteMode] = useState<"notStarted" | "started" | "fading" | "ended">("notStarted");
  const [mode, setMode] = useState<
    "viewStoryRoots" | "createStoryRoot" | "viewStoryRoot" | "viewStoryBranch" | "createStoryBranch"
  >("viewStoryRoots");
  const [forkedFrom, setForkedFrom] = useState<number>();

  const [stories, setStories] = useState<any[]>(mockRootNFTs);
  const [storyBranches, setStoryBranches] = useState<any[]>([]);
  const [selectedStoryRootIndex, setSelectedStoryRootIndex] = useState<number>();
  const [storyRootContent, setStoryRootContent] = useState("");

  const [selectedStoryBranchIndex, setSelectedStoryBranchIndex] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // dev
  const [policyId] = useState(defaultPolicyId);
  const [licenceAmount] = useState(defaultLicenseAmount);
  const [creatingStoryRootName, setCreatingStoryRootName] = useState("");
  const [creatingStoryRootContent, setCreatingStoryRootContent] = useState("");
  const [isBranchContentLoaded, setIsBranchContentLoaeded] = useState(false);
  const [oracleResponses, setOracleResponses] = useState<string[]>([]);
  const [userInteractions, setUserInteractions] = useState<string[]>([]);

  const { branchContent, isStarted, isUserInteractionRequired, isWaitingOracleResponse } = useMemo(() => {
    let branchContent = "";
    oracleResponses.forEach((response, index) => {
      branchContent += `**Oracle:** \n${response}\n\n\n`; // Add oracle response
      if (index < userInteractions.length) {
        branchContent += `**User:** \n${userInteractions[index]}\n\n\n`; // Add user interaction if it exists
      }
    });
    return {
      branchContent,
      isStarted: isBranchContentLoaded && oracleResponses.length > 0,
      isUserInteractionRequired: oracleResponses.length > userInteractions.length,
      isWaitingOracleResponse: oracleResponses.length == userInteractions.length,
    };
  }, [isBranchContentLoaded, oracleResponses, userInteractions]);

  const [interactionContent, setInteractionContent] = useState("");

  const opacityClass = spriteMode === "started" ? "opacity-100" : "opacity-0";
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_DISABLE_SPRITE === "true") {
      setSpriteMode("ended");
    } else {
      setSpriteMode("started");
      setTimeout(() => {
        setSpriteMode("fading"); // Start fading out after the duration
        setTimeout(() => {
          setSpriteMode("ended"); // Completely hide after the fade out
        }, 1000); // Assuming the fade out duration is 1000ms
      }, spriteDuration);
    }
  }, []);

  useEffect(() => {
    setStoryRootContent("");
    if (stories.length == 0 || selectedStoryRootIndex == undefined || selectedStoryRootIndex >= stories.length) {
      return;
    }
    const story = stories[selectedStoryRootIndex];
    // access eth storage node to handle blob data
    const provider = new ethers.providers.JsonRpcProvider(sepoliaEthereumStorageNodeRPC);
    const contract = new ethers.Contract(story.rootContentLocation_directory, IERC5018Abi, provider);
    contract
      .read(story.rootContentLocation_name)
      .then(([content]: [string]) => {
        if (content == "0x") {
          setStoryRootContent("Failed to load blob data from Ethereum Storage Node, please try again later.");
        } else {
          setStoryRootContent(ethers.utils.toUtf8String(content).replace(/[\u0000\u0020]+$/, ""));
        }
      })
      .catch((e: Error) => {
        console.log(e.message);
        setStoryRootContent("Failed to load blob data from Ethereum Storage Node, please try again later.");
      });
  }, [stories, selectedStoryRootIndex]);

  useEffect(() => {
    if (!rootQueryResult) {
      return;
    }
    setStories(rootQueryResult.rootContentMinteds);
  }, [rootQueryLoading, rootQueryResult]);

  useEffect(() => {
    console.log(branchQueryResult);
    if (!branchQueryResult) {
      return;
    }
    setStoryBranches(branchQueryResult.branchContentMinteds);
  }, [branchQueryLoading, branchQueryResult]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (mode == "createStoryBranch") {
        const contract = new ethers.Contract(storyBranchMinterL1Address, storyBranchMinterL1Abi, signer);
        const branchContentId = await contract.activeBranchContentIds(connectedAddress);
        const rootTokenId = await contract.rootTokenIds(branchContentId);
        if (!ethers.BigNumber.from(stories[selectedStoryRootIndex as number].tokenId).eq(rootTokenId)) {
          throw new Error("Token Id mismatch!!");
        }
        const [, oracleResponses, userInteractions] = await contract.getContent(branchContentId);
        console.log(oracleResponses);
        console.log(userInteractions);
        setIsBranchContentLoaeded(true);
        setOracleResponses(oracleResponses);
        setUserInteractions(userInteractions);
      }
    }, 2500);
    return () => {
      setIsBranchContentLoaeded(false);
      setOracleResponses([]);
      setUserInteractions([]);
      clearInterval(interval);
    };
  }, [mode]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-violet-300 to-pink-300">
      {(spriteMode === "started" || spriteMode === "fading") && (
        <div
          className={`w-full h-screen flex justify-center items-center transition-opacity duration-1000 ease-in-out ${
            spriteMode === "started" ? "opacity-100" : "opacity-0"
          }`}
        >
          <img src="./assets/sprite.gif" className="h-80 mx-auto items-center" />
        </div>
      )}
      {spriteMode == "ended" && (
        <>
          <header className="w-full py-4 bg-transparent backdrop-blur-md">
            <div className="flex justify-between items-center px-4">
              {!isConnected && <div />}
              {isConnected && (
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  <div>
                    <img src="./assets/logo.png" className="h-6 mx-auto items-center" />
                  </div>
                </div>
              )}
              <ConnectButton />
            </div>
          </header>
          <div className="flex flex-col justify-center items-center pt-4 pb-12 px-4">
            {!isConnected && (
              <div className="fixed inset-y-20 flex justify-center items-center">
                <div className="text-center w-full max-w-2xl px-4">
                  <img src="./assets/hero.png" className="h-40 mx-auto mb-4" />
                  <p className="text-white font-medium text-md mb-8">
                    2 lines of explanation2 lines of explanation2 lines of explanation2 lines of explanation3 lines of
                    explanation2 lines of explanation2
                  </p>
                  <button
                    className="w-40 py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => {
                      if (!openConnectModal) {
                        return;
                      }
                      openConnectModal();
                    }}
                  >
                    Start
                  </button>
                </div>
              </div>
            )}
            {isConnected && (
              <>
                <div className="mb-4 flex justify-between items-center w-full max-w-4xl h-8">
                  <div className="cursor-pointer text-white hover:text-gray-100">
                    {mode == "createStoryRoot" && (
                      <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoots")} />
                    )}
                    {mode == "viewStoryRoot" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoots")} />}
                    {mode == "viewStoryBranch" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoot")} />}
                    {mode == "createStoryBranch" && (
                      <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoot")} />
                    )}
                  </div>
                </div>
                <div className="bg-white backdrop-blur-lg py-8 px-6 rounded-md shadow-2xl w-full max-w-4xl mx-auto">
                  {mode == "viewStoryRoots" && (
                    <div>
                      <div className="flex justify-between mb-4">
                        <h2 className="text-xl md:text-4xl font-semibold text-gray-800">View Story Roots</h2>
                        <div>
                          <button
                            className="block text-sm px-3 md:px-4 py-1 md:py-2 font-bold text-indigo-600 rounded-md hover:opacity-75 outline"
                            onClick={() => {
                              setMode("createStoryRoot");
                            }}
                          >
                            Create Root
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-2 break-all">
                        {stories.map((story, index) => (
                          <div
                            key={index}
                            className="w-full p-4 rounded-md shadow-md overflow-hidden cursor-pointer hover:bg-gray-100"
                            onClick={() => {
                              setSelectedStoryRootIndex(index);
                              setMode("viewStoryRoot");
                            }}
                          >
                            <div className="flex flex-col">
                              <p className="text-md font-semibold text-gray-600 mb-2">
                                {ethers.utils
                                  .toUtf8String(story.rootContentLocation_name)
                                  .substring(
                                    0,
                                    ethers.utils.toUtf8String(story.rootContentLocation_name).length - namePostfixLength
                                  )}
                              </p>
                              <p className="text-xs text-gray-600 mb-1">Creator: {story.creator}</p>
                              <h3 className="text-xs text-gray-600 mb-1">Story Protocol IP ID: {story.ipId}</h3>
                              <p className="text-xs text-gray-600">{`Content: web3://${
                                story.rootContentLocation_directory
                              }:11155111/${ethers.utils.toUtf8String(story.rootContentLocation_name)}`}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {mode == "createStoryRoot" && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-xl md:text-4xl font-semibold text-gray-800">Create Story Root</h2>
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Content Name</label>
                        </div>
                        <input
                          type="text"
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={creatingStoryRootName}
                          onChange={(e) => {
                            setCreatingStoryRootName(e.target.value);
                          }}
                        />
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Story Protocol Policy ID</label>
                        </div>
                        <input
                          type="text"
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={policyId}
                          disabled
                        />
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Story Protocol License Amount
                          </label>
                        </div>
                        <input
                          type="text"
                          className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={licenceAmount}
                          disabled
                        />
                      </div>
                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">Content Prompt</label>
                        </div>
                        <textarea
                          rows={20}
                          className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={creatingStoryRootContent}
                          onChange={(e) => {
                            setCreatingStoryRootContent(e.target.value);
                          }}
                        ></textarea>
                      </div>
                      <div>
                        <button
                          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                          disabled={
                            !creatingStoryRootName ||
                            creatingStoryRootName.length > 100 ||
                            !creatingStoryRootContent ||
                            creatingStoryRootContent.length > 10000
                          }
                          onClick={async () => {
                            console.log("start create story root...");
                            const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/upload`;
                            const options = {
                              method: "POST",
                              headers: {
                                "Content-Type": "application/json",
                              },
                              body: JSON.stringify({
                                name: creatingStoryRootName,
                                content: creatingStoryRootContent,
                              }),
                            };
                            console.log("uploading to eth storage...");
                            const data = await fetch(url, options)
                              .then((response) => {
                                if (!response.ok) {
                                  return response.text().then((text) => {
                                    throw new Error(text);
                                  });
                                }
                                return response.json();
                              })
                              .catch((error) => {
                                console.error("Error uploading data:", error);
                              });
                            if (!data) {
                              return;
                            }
                            const { data: ethstorageUloadResponse } = data;
                            console.log("ethstorageUloadResponse", ethstorageUloadResponse);

                            console.log("waiting upload blob tx is confirmed...");

                            console.log("mint root nft and register in story protocol...");
                            const contract = new ethers.Contract(contentNFTAddress, contentNFTAbi, signer);
                            const tx = await contract.mintRoot(
                              ethstorageUloadResponse.directory,
                              ethers.utils.hexlify(ethers.utils.toUtf8Bytes(ethstorageUloadResponse.name)),
                              policyId,
                              licenceAmount
                            );
                            console.log("done!!");
                            console.log(tx.hash);
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  )}
                  {mode == "viewStoryRoot" && selectedStoryRootIndex != undefined && (
                    <div>
                      <div className="flex justify-between mb-4">
                        <h2 className="text-xl md:text-4xl font-semibold text-gray-800">View Story Root</h2>
                        <div>
                          <button
                            className="block text-sm px-3 md:px-4 py-1 md:py-2 font-bold text-indigo-600 rounded-md hover:opacity-75 outline"
                            onClick={() => {
                              setMode("createStoryBranch");
                              window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth",
                              });
                            }}
                          >
                            Create Branch
                          </button>
                        </div>
                      </div>
                      <div className={storyBranches.length > 0 ? "mb-8" : ""}>
                        <div className="w-full p-4 rounded-md shadow-md overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-md font-semibold text-gray-600 mb-2">
                              {ethers.utils
                                .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                .substring(
                                  0,
                                  ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                    .length - namePostfixLength
                                )}
                            </p>
                            <p className="text-xs text-gray-600 mb-1">
                              Creator: {stories[selectedStoryRootIndex].creator}
                            </p>
                            <h3 className="text-xs text-gray-600 mb-1">
                              Story Protocol IP ID: {stories[selectedStoryRootIndex].ipId}
                            </h3>
                            <p className="text-xs text-gray-600 mb-4">{`Content: web3://${
                              stories[selectedStoryRootIndex].rootContentLocation_directory
                            }:11155111/${ethers.utils.toUtf8String(
                              stories[selectedStoryRootIndex].rootContentLocation_name
                            )}`}</p>
                            <p className="text-sm text-gray-600">
                              {storyRootContent != ""
                                ? storyRootContent
                                : "Loading blob data from Ethereum Storage Node..."}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        {storyBranches.length > 0 && (
                          <label className="block text-sm font-medium text-gray-700 mb-2">Story Branches</label>
                        )}
                        <div className="grid grid-cols-1 gap-2 break-all">
                          {storyBranches.map((storyBranche, index) => (
                            <div
                              key={index}
                              className="w-full p-4 rounded-md shadow-md overflow-hidden cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                setSelectedStoryRootIndex(index);
                                setMode("viewStoryRoot");
                              }}
                            >
                              <div className="flex flex-col">
                                <p className="text-md font-semibold text-gray-600 mb-2">
                                  {/* {ethers.utils
                            .toUtf8String(story.rootContentLocation_name)
                            .substring(
                              0,
                              ethers.utils.toUtf8String(story.rootContentLocation_name).length - namePostfixLength
                            )} */}
                                </p>
                                <p className="text-xs text-gray-600 mb-1">Creator: </p>
                                <h3 className="text-xs text-gray-600 mb-1">Story Protocol IP ID:</h3>
                                <p className="text-xs text-gray-600">{`Content: web3://${""}:11155111/${""}`}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {mode == "viewStoryBranch" && selectedStoryRootIndex != undefined && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">View Story Branch</h2>
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Story Root</label>
                        <div className="w-full h-20 mt-2">
                          <img src={stories[selectedStoryRootIndex]} className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Story Branch</label>
                      </div>
                    </div>
                  )}
                  {mode == "createStoryBranch" && selectedStoryRootIndex != undefined && (
                    <div>
                      <div className="mb-4">
                        <h2 className="text-xl md:text-4xl font-semibold text-gray-800">Create Story Branch</h2>
                      </div>
                      {/* <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Story Branch</h2> */}
                      <div className="w-full p-4 rounded-md shadow-md overflow-hidden mb-4">
                        <div className="flex flex-col">
                          <p className="text-md font-semibold text-gray-600 mb-2">
                            {ethers.utils
                              .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                              .substring(
                                0,
                                ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                  .length - namePostfixLength
                              )}
                          </p>
                          <p className="text-xs text-gray-600 mb-1">
                            Creator: {stories[selectedStoryRootIndex].creator}
                          </p>
                          <h3 className="text-xs text-gray-600 mb-1">
                            Story Protocol IP ID: {stories[selectedStoryRootIndex].creator}
                          </h3>
                          <p className="text-xs text-gray-600 mb-4">{`Content: web3://${
                            stories[selectedStoryRootIndex].rootContentLocation_directory
                          }:11155111/${ethers.utils.toUtf8String(
                            stories[selectedStoryRootIndex].rootContentLocation_name
                          )}`}</p>
                          <p className="text-sm text-gray-600">
                            {storyRootContent != ""
                              ? storyRootContent
                              : "Loading blob data from Ethereum Storage Node..."}
                          </p>
                        </div>
                      </div>
                      {branchContent && <Markdown className="mb-4">{branchContent}</Markdown>}
                      <div className="space-y-4">
                        {!isBranchContentLoaded && (
                          <div className="flex justify-center items-center pt-4">
                            <AiOutlineLoading className="animate-spin text-3xl text-indigo-600" />
                          </div>
                        )}
                        {isBranchContentLoaded && !isStarted && (
                          <button
                            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={!storyRootContent}
                            onClick={async () => {
                              const tokenId = stories[selectedStoryRootIndex].tokenId;
                              const contract = new ethers.Contract(
                                storyBranchMinterL1Address,
                                storyBranchMinterL1Abi,
                                signer
                              );
                              const tx = await contract.startBranchContent(tokenId);
                              console.log(tx);
                            }}
                          >
                            Start
                          </button>
                        )}
                        {isBranchContentLoaded && isStarted && (
                          <div>
                            <textarea
                              rows={4}
                              className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed mb-4"
                              value={interactionContent}
                              disabled={isWaitingOracleResponse || !isUserInteractionRequired}
                              onChange={(e) => {
                                setInteractionContent(e.target.value);
                              }}
                            ></textarea>
                            <button
                              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={
                                isWaitingOracleResponse ||
                                !isUserInteractionRequired ||
                                !interactionContent ||
                                interactionContent.length > 120
                              }
                              onClick={async () => {
                                const tokenId = stories[selectedStoryRootIndex].tokenId;
                                const contract = new ethers.Contract(
                                  storyBranchMinterL1Address,
                                  storyBranchMinterL1Abi,
                                  signer
                                );
                                const tx = await contract.interactFromCreator(interactionContent);
                                console.log(tx);
                                setInteractionContent("");
                              }}
                            >
                              Send
                            </button>
                          </div>
                        )}
                        {isBranchContentLoaded && isStarted && (
                          <div className="flex space-x-4">
                            <button
                              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-black bg-gray-300 hover:bg-gray-400 focus:outline-none disabled:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isWaitingOracleResponse || !isUserInteractionRequired}
                              onClick={async () => {
                                const contract = new ethers.Contract(
                                  storyBranchMinterL1Address,
                                  storyBranchMinterL1Abi,
                                  signer
                                );
                                const tx = await contract.cancelBranchContent();
                                console.log(tx);
                              }}
                            >
                              Cancel
                            </button>
                            <button
                              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                              disabled={isWaitingOracleResponse || !isUserInteractionRequired}
                              onClick={async () => {
                                const contract = new ethers.Contract(
                                  storyBranchMinterL1Address,
                                  storyBranchMinterL1Abi,
                                  signer
                                );
                                const tx = await contract.endBranchContent();
                                console.log(tx);
                              }}
                            >
                              Publish
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div>
              <div className="mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Send Transaction</h3>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  onClick={() => {
                    setIsModalOpen(false);
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
