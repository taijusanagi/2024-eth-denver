"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import { MdArrowBackIos } from "react-icons/md";
import { AiOutlineLoading } from "react-icons/ai";
import Markdown from "react-markdown";
import { GiReceiveMoney } from "react-icons/gi";

import { GiTeamIdea } from "react-icons/gi";
import { TbLicense } from "react-icons/tb";
import { FaMoneyBillWave } from "react-icons/fa";

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
  sepoliaRPC,
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
const spriteDuration = 1500;
const loadingMessageFromESNode = "Loading blob data from Ethereum Storage Node...";
const errorMessageFromESNode = "Failed to load blob data from Ethereum Storage Node, please try again later.";

const messageForWaitingUserInteraction = "Please interact with the on-chain AI based TRPG to continue!";
const messageForWaitingTxConfirmation = "Waiting for interact transaction confirmation...";
const messageForWaitingOracleResponse = "Waiting for AI response by Chainlink Functions...";

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
  query MyQuery($rootTokenId: String!) {
    branchContentMinteds(where: { rootTokenId: $rootTokenId }, orderBy: tokenId, orderDirection: desc) {
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

  const { isConnected } = useIsConnected();

  const [spriteMode, setSpriteMode] = useState<"notStarted" | "started" | "fading" | "ended">("notStarted");
  const [mode, setMode] = useState<
    "viewStoryRoots" | "createStoryRoot" | "viewStoryRoot" | "viewStoryBranch" | "createStoryBranch"
  >("viewStoryRoots");

  const [stories, setStories] = useState<any[]>(mockRootNFTs);
  const [storyBranches, setStoryBranches] = useState<any[]>([]);
  const [selectedStoryRootIndex, setSelectedStoryRootIndex] = useState<number>();
  const [storyRootContent, setStoryRootContent] = useState("");

  //stories[selectedStoryRootIndex].tokenId;
  const [selectedRootTokenId, setSelectedRootTokenId] = useState("0");

  // console.log("selectedRootTokenId", selectedRootTokenId);

  const {
    loading: branchQueryLoading,
    data: branchQueryResult,
    refetch,
  } = useQuery(BRANCH_QUERY, {
    variables: { rootTokenId: "0" }, // Pass variable to query
  });

  const [selectedStoryBranchIndex, setSelectedStoryBranchIndex] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = (content: any) => {
    setModalContent(content);
    setIsModalOpen(true);
  };

  // dev
  const [policyId] = useState(defaultPolicyId);
  const [licenceAmount] = useState(defaultLicenseAmount);
  const [creatingStoryRootName, setCreatingStoryRootName] = useState("");
  const [creatingStoryRootContent, setCreatingStoryRootContent] = useState("");
  const [isBranchContentLoaded, setIsBranchContentLoaeded] = useState(false);
  const [oracleResponses, setOracleResponses] = useState<string[]>([]);
  const [userInteractions, setUserInteractions] = useState<string[]>([]);

  const [branchLog, setBranchLog] = useState("");

  const [modalContent, setModalContent] = useState<any>();

  const { branchContent, isStarted, isUserInteractionRequired, isWaitingOracleResponse } = useMemo(() => {
    let branchContent = "";
    oracleResponses.forEach((response, index) => {
      branchContent += `**StoryTelller:**\n\n${
        response ? response : "Chainlink Functions computation failed, please try again."
      }\n\n\n\n`; // Add oracle response
      if (index < userInteractions.length) {
        branchContent += `**User:**\n\n${userInteractions[index]}\n\n\n\n`; // Add user interaction if it exists
      }
    });
    return {
      branchContent,
      isStarted: isBranchContentLoaded && oracleResponses.length > 0,
      isUserInteractionRequired: oracleResponses.length > userInteractions.length,
      isWaitingOracleResponse: oracleResponses.length == userInteractions.length,
    };
  }, [isBranchContentLoaded, oracleResponses, userInteractions]);

  const [previoudOracleResponseCount, setPrevioudOracleResponseCount] = useState(0);
  useEffect(() => {
    if (previoudOracleResponseCount != oracleResponses.length) {
      setPrevioudOracleResponseCount(oracleResponses.length);
      setBranchLog(messageForWaitingUserInteraction);
      console.log("content updated!");
    }
  }, [previoudOracleResponseCount, branchContent, oracleResponses, userInteractions]);

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
    setStoryRootContent(loadingMessageFromESNode);
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
        console.log("Root story content loaded...!!!");
        if (content == "0x") {
          setStoryRootContent(errorMessageFromESNode);
        } else {
          setStoryRootContent(
            // some times the null bytes is incerted into the content, so remove it for now
            // this is maybe because of the blob conversion
            ethers.utils
              .toUtf8String(content)
              .replace(/\u0000/g, "") // first null bytes
              .replace(/\s+$/, "") // then trim
          );
        }
      })
      .catch((e: Error) => {
        console.log(e.message);
        setStoryRootContent(errorMessageFromESNode);
      });
  }, [stories, selectedStoryRootIndex]);

  useEffect(() => {
    if (!rootQueryResult) {
      return;
    }
    setStories(rootQueryResult.rootContentMinteds);
  }, [rootQueryLoading, rootQueryResult]);

  useEffect(() => {
    // console.log("branchQueryResult", branchQueryResult, selectedRootTokenId);
    if (!branchQueryResult) {
      return;
    }
    setStoryBranches(branchQueryResult.branchContentMinteds);
  }, [branchQueryLoading, branchQueryResult]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (mode == "createStoryBranch") {
        const contract = new ethers.Contract(storyBranchMinterL1Address, storyBranchMinterL1Abi, signer);
        const branchContentId = (await contract.activeBranchContentIds(connectedAddress)) as ethers.BigNumber;
        if (branchContentId.gt(0)) {
          const rootTokenId = await contract.rootTokenIds(branchContentId);
          if (!ethers.BigNumber.from(stories[selectedStoryRootIndex as number].tokenId).eq(rootTokenId)) {
            // throw new Error("You are creating different token, please cancel that or use different account to test.");
            openModal(() => <GuideModalContent activeRootToken={rootTokenId} />);
            return;
          }
          const [, oracleResponses, userInteractions] = await contract.getContent(branchContentId);
          setIsBranchContentLoaeded(true);
          setOracleResponses(oracleResponses);
          setUserInteractions(userInteractions);
        } else {
          setIsBranchContentLoaeded(true);
        }
      }
    }, 2500);
    return () => {
      setIsBranchContentLoaeded(false);
      setOracleResponses([]);
      setUserInteractions([]);
      clearInterval(interval);
    };
  }, [mode]);

  const CustomImage = ({ src, alt }: any) => {
    return src == "https://2024-eth-denver.vercel.app/trpg/$%7Barea%7D.png" ? undefined : <img src={src} alt={alt} />;
  };

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // or 'visible' if you want
    }
    return () => {
      document.body.style.overflow = "auto"; // reset on unmount
    };
  }, [isModalOpen]);

  const IncentiveModal = () => {
    return (
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Decentralized Incentive program with Story Protocol&apos;s IPFi
            </h3>
            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-500 pb-2">
              &times;
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
          <div className="flex flex-col border p-4 rounded-lg h-full">
            <div className="flex-1">
              <GiTeamIdea className="mx-auto my-4 mt-2 text-4xl text-indigo-600" /> {/* Icon for IP */}
              <h4 className="font-medium text-gray-900 mb-2 text-xl text-center">IP</h4>
              <p className="text-gray-600 text-xs text-center mb-4">
                Trade your content NFT, which serves as the key to accessing its associated intellectual property.
                Trading this NFT transfers full control of the IP, allowing new owners to harness its value.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                disabled
                type="button"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start
              </button>
            </div>
          </div>
          <div className="flex flex-col border p-4 rounded-lg h-full">
            <div className="flex-1">
              <TbLicense className="mx-auto mb-4 mt-2 text-4xl text-indigo-600" /> {/* Icon for License */}
              <h4 className="font-medium text-gray-900 mb-2 text-xl text-center">License</h4>
              <p className="text-gray-600 text-xs text-center mb-4">
                Trade licenses that permit the generation of new child IPs. By acquiring a license, you gain the ability
                to create derivative works and expand on the original intellectual property.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                disabled
                type="button"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start
              </button>
            </div>
          </div>
          <div className="flex flex-col border p-4 rounded-lg h-full">
            <div className="flex-1">
              <FaMoneyBillWave className="mx-auto mb-4 mt-2 text-4xl text-indigo-600" /> {/* Icon for Royalty */}
              <h4 className="font-medium text-gray-900 mb-2 text-xl text-center">Royalty</h4>
              <p className="text-gray-600 text-xs text-center mb-4">
                Trade your rights to receive future royalties from child IPs. This allows you to monetize your share of
                the earnings from derivative works, transferring your income rights to others.
              </p>
            </div>
            <div className="flex justify-center">
              <button
                disabled
                type="button"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [steps, setSteps] = useState<any>([]);
  const StepModalContent = ({ steps }: any) => {
    const allStepsCompleted = steps.every((step: any) => step.status === "complete");
    return (
      <div className="flex flex-col">
        {steps.map((step: any, index: number) => (
          <div key={index} className="mb-4">
            <div className={`flex items-center text-sm ${index !== steps.length - 1 ? "mb-2" : ""}`}>
              <span
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  step.status === "complete"
                    ? "bg-green-500"
                    : step.status === "current"
                    ? "bg-blue-500"
                    : "bg-gray-200"
                }`}
              >
                {step.status === "complete" ? (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <div className="ml-4">
                <p className={`font-semibold ${step.status === "current" ? "text-blue-600" : "text-gray-900"}`}>
                  {step.name}
                </p>
                <p className={`text-xs ${step.status === "current" ? "text-blue-500" : "text-gray-500"}`}>
                  {step.description}
                </p>
              </div>
            </div>
            {index !== steps.length - 1 && (
              <div className="ml-4 pl-1">
                <div className="h-full w-0.5 bg-gray-300"></div>
              </div>
            )}
          </div>
        ))}
        <button
          className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!allStepsCompleted}
          onClick={() => {
            window.location.reload();
          }}
        >
          Close
        </button>
      </div>
    );
  };

  const GuideModalContent = ({ activeRootToken }: any) => {
    return (
      <div>
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Error</h3>
            <button onClick={() => setIsModalOpen(false)} className="text-3xl text-gray-400 hover:text-gray-500 pb-2">
              &times;
            </button>
          </div>
        </div>
        <p className="text-md text-gray-800 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
          You are creating different token, please cancel or publish that.
        </p>
        <div className="flex flex-col">
          <button
            className="mt-4 w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
            // disabled={!allStepsCompleted}
            onClick={() => {
              // window.location.reload();

              const rootTokenIndex = stories.findIndex((story) => {
                return ethers.BigNumber.from(story.tokenId).eq(ethers.BigNumber.from(activeRootToken));
              });
              setSelectedStoryRootIndex(rootTokenIndex);
              setMode("viewStoryRoot");
              setIsModalOpen(false);
            }}
          >
            Move
          </button>
        </div>
      </div>
    );
  };

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
                <div className="mb-4 flex justify-between items-center w-full max-w-5xl h-8">
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
                <div className="bg-gray-50 backdrop-blur-lg py-8 px-6 rounded-md shadow-2xl w-full max-w-5xl mx-auto">
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
                      <div className="grid grid-cols-1 gap-4 p-0 md:p-4">
                        {stories.map((story, index) => (
                          <div
                            key={index}
                            className="w-full py-6 px-4 md:px-6 rounded-lg border border-gray-200 shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:border-gray-300 cursor-pointer overflow-hidden"
                            onClick={() => {
                              setSelectedStoryRootIndex(index);
                              setMode("viewStoryRoot");
                            }}
                          >
                            <div className="flex flex-col">
                              <p className="text-lg font-semibold text-gray-800 mb-3 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                {ethers.utils
                                  .toUtf8String(story.rootContentLocation_name)
                                  .substring(
                                    0,
                                    ethers.utils.toUtf8String(story.rootContentLocation_name).length - namePostfixLength
                                  )}
                              </p>
                              <p className="text-sm text-gray-500 mb-2">TokenId: {story.tokenId}</p>
                              <p className="text-sm text-gray-500 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                Story Protocol IP ID: {story.ipId}
                              </p>
                              <p className="text-sm text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis">
                                Content: web3://{story.rootContentLocation_directory}:11155111/
                                {ethers.utils.toUtf8String(story.rootContentLocation_name)}
                              </p>
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
                            let steps = [
                              {
                                name: "Upload content",
                                description:
                                  "ETHStorage SDK helps to encode content into blob and upload to EIP-4844 blob storage",
                                status: "upcoming",
                              },
                              {
                                name: "Waiting upload tx confirmation",
                                description: "Upload tx is going to be confirmed on-chain soon",
                                status: "upcoming",
                              },
                              {
                                name: "Mint NFT and Register as IP",
                                description:
                                  "Our custom contract helps you to mint NFT and register as IP in Story Protocol in one transaction!",
                                status: "upcoming",
                              },
                              {
                                name: "Waiting mint tx confirmation",
                                description: "Mint tx is going to be confirmed on-chain soon",
                                status: "upcoming",
                              },
                            ];
                            steps[0].status = "current";
                            setModalContent(() => <StepModalContent steps={steps} />);
                            setIsModalOpen(true);

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
                            steps[0].status = "complete";
                            steps[1].status = "current";
                            setModalContent(() => <StepModalContent steps={steps} />);

                            const { data: ethstorageUloadResponse } = data;
                            console.log("ethstorageUloadResponse", ethstorageUloadResponse);

                            console.log("waiting upload blob tx is confirmed...");
                            const provider = new ethers.providers.JsonRpcProvider(sepoliaRPC);
                            await provider.waitForTransaction(ethstorageUloadResponse.txHash);

                            steps[1].status = "complete";
                            steps[2].status = "current";
                            setModalContent(() => <StepModalContent steps={steps} />);

                            console.log("mint root nft and register in story protocol...");
                            const contract = new ethers.Contract(contentNFTAddress, contentNFTAbi, signer);
                            const tx = await contract.mintRoot(
                              ethstorageUloadResponse.directory,
                              ethers.utils.hexlify(ethers.utils.toUtf8Bytes(ethstorageUloadResponse.name)),
                              policyId,
                              licenceAmount
                            );

                            steps[2].status = "complete";
                            steps[3].status = "current";
                            setModalContent(() => <StepModalContent steps={steps} />);

                            await tx.wait();
                            steps[3].status = "complete";
                            setModalContent(() => <StepModalContent steps={steps} />);
                            console.log(tx.hash);
                            console.log("done!!");
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
                        <div className="flex items-center space-x-4">
                          <GiReceiveMoney
                            className="text-indigo-600 text-xl hover:opacity-75 cursor-pointer"
                            onClick={() => {
                              openModal(() => <IncentiveModal />);
                            }}
                          />
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
                      <div className={storyBranches.length > 0 ? "mb-8 p-0 md:p-4" : "p-0 md:p-4"}>
                        <div className="w-full py-6 px-4 md:px-6 rounded-lg border border-gray-200 shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:border-gray-300 overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-lg font-semibold text-gray-800 mb-3 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              {ethers.utils
                                .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                .substring(
                                  0,
                                  ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                    .length - namePostfixLength
                                )}
                            </p>
                            <p className="text-sm text-gray-500 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              TokenId: {stories[selectedStoryRootIndex].tokenId}
                            </p>
                            <h3 className="text-sm text-gray-500 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              Story Protocol IP ID: {stories[selectedStoryRootIndex].ipId}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 overflow-hidden whitespace-nowrap overflow-ellipsis">{`Content: web3://${
                              stories[selectedStoryRootIndex].rootContentLocation_directory
                            }:11155111/${ethers.utils.toUtf8String(
                              stories[selectedStoryRootIndex].rootContentLocation_name
                            )}`}</p>
                            {storyRootContent == loadingMessageFromESNode && (
                              <p className="text-center py-2 text-sm text-blue-500 bg-blue-100 rounded-lg">
                                {loadingMessageFromESNode}
                              </p>
                            )}
                            {storyRootContent == errorMessageFromESNode && (
                              <p className="text-center py-2 text-sm text-red-500 bg-red-100 rounded-lg">
                                {errorMessageFromESNode}
                              </p>
                            )}
                            {storyRootContent != loadingMessageFromESNode &&
                              storyRootContent != errorMessageFromESNode && (
                                <Markdown
                                  className="md-content"
                                  components={{
                                    img: CustomImage,
                                  }}
                                >
                                  {storyRootContent}
                                </Markdown>
                              )}
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
                      <div className="p-4">
                        <div className="w-full py-6 px-4 md:px-6 rounded-lg border border-gray-200 shadow-lg transition duration-300 ease-in-out hover:shadow-xl hover:border-gray-300 overflow-hidden">
                          <div className="flex flex-col">
                            <p className="text-lg font-semibold text-gray-800 mb-3 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              {ethers.utils
                                .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                .substring(
                                  0,
                                  ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                                    .length - namePostfixLength
                                )}
                            </p>
                            <p className="text-sm text-gray-500 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              TokenId: {stories[selectedStoryRootIndex].tokenId}
                            </p>
                            <h3 className="text-sm text-gray-500 mb-2 overflow-hidden whitespace-nowrap overflow-ellipsis">
                              Story Protocol IP ID: {stories[selectedStoryRootIndex].ipId}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4 overflow-hidden whitespace-nowrap overflow-ellipsis">{`Content: web3://${
                              stories[selectedStoryRootIndex].rootContentLocation_directory
                            }:11155111/${ethers.utils.toUtf8String(
                              stories[selectedStoryRootIndex].rootContentLocation_name
                            )}`}</p>
                            {storyRootContent == loadingMessageFromESNode && (
                              <p className="text-center py-2 text-sm text-blue-500 bg-blue-100 rounded-lg">
                                {loadingMessageFromESNode}
                              </p>
                            )}

                            {storyRootContent == errorMessageFromESNode && (
                              <p className="text-center py-2 text-sm text-red-500 bg-red-100 rounded-lg">
                                {errorMessageFromESNode}
                              </p>
                            )}
                            {storyRootContent != loadingMessageFromESNode &&
                              storyRootContent != errorMessageFromESNode && (
                                <Markdown
                                  className="md-content"
                                  components={{
                                    img: CustomImage,
                                  }}
                                >
                                  {storyRootContent}
                                </Markdown>
                              )}
                          </div>
                        </div>
                      </div>

                      {branchContent && (
                        <div className="py-4">
                          <Markdown className="mb-4 md-content">{branchContent}</Markdown>{" "}
                        </div>
                      )}

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
                              console.log("rooTokenId", tokenId);
                              const tx = await contract.startBranchContent(tokenId);
                              console.log(tx);
                              setBranchLog(messageForWaitingTxConfirmation);
                              await tx.wait();
                              setBranchLog(messageForWaitingOracleResponse);
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
                                interactionContent.length > 120 ||
                                branchLog != messageForWaitingUserInteraction
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
                                setBranchLog(messageForWaitingTxConfirmation);
                                await tx.wait();
                                setBranchLog(messageForWaitingOracleResponse);
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
                              disabled={
                                isWaitingOracleResponse ||
                                !isUserInteractionRequired ||
                                branchLog != messageForWaitingUserInteraction
                              }
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
                              disabled={
                                isWaitingOracleResponse ||
                                !isUserInteractionRequired ||
                                branchLog != messageForWaitingUserInteraction
                              }
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
                        <div className="text-center mt-1">
                          <p className="text-gray-400 font-bold text-xs">
                            {!isBranchContentLoaded ? "Loading the on-chain TRPG interaction history..." : branchLog}
                          </p>
                        </div>
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
          <div className="bg-white p-6 rounded-md shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {modalContent}
          </div>
        </div>
      )}
    </main>
  );
}
