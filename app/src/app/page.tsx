"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MdArrowBackIos } from "react-icons/md";

import { useAccount, useWriteContract } from "wagmi";
import { useQuery, gql } from "@apollo/client";

import { useEthersSigner } from "@/lib/ethers";
import { ethers } from "ethers";
import { contentNFTAbi, contentNFTAddress } from "@/lib/contracts";
import { mockRootNFTs } from "@/lib/mock";
import { IERC5018Abi } from "@/lib/ethstorage";

// content name is modified in backend like ${name}-1709156261098.txt
// so this can be removed in frontend for better display
const namePostfixLength = 18;
const defaultPolicyId = 1;
const defaultLicenseAmount = 100;

const ROOT_QUERY = gql`
  query {
    rootContentMinteds(orderBy: tokenId, orderDirection: desc) {
      tokenId
      rootContentLocation_directory
      rootContentLocation_name
      creator
    }
  }
`;

const BRANCH_QUERY = gql`
  query {
    branchContentMinteds(orderBy: tokenId, orderDirection: desc) {
      tokenId
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

  const { loading, error, data } = useQuery(ROOT_QUERY);

  const [mode, setMode] = useState<
    "viewStoryRoots" | "createStoryRoot" | "viewStoryRoot" | "viewStoryBranch" | "createStoryBranch"
  >("viewStoryRoots");
  const [forkedFrom, setForkedFrom] = useState<number>();

  // const [stories, setStories] = useState<any[]>(mockRootNFTs);
  const [stories, setStories] = useState<any[]>([]);
  const [selectedStoryRootIndex, setSelectedStoryRootIndex] = useState<number>();
  const [storyRootContent, setStoryRootContent] = useState("");

  const [storyBranches, setStoryBranches] = useState([
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
  ]);
  const [selectedStoryBranchIndex, setSelectedStoryBranchIndex] = useState<number>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // dev
  const [policyId] = useState(defaultPolicyId);
  const [licenceAmount] = useState(defaultLicenseAmount);
  const [creatingStoryRootName, setCreatingStoryRootName] = useState("");
  const [creatingStoryRootContent, setCreatingStoryRootContent] = useState("");
  const [interactionContent, setInteractionContent] = useState("");

  const storyBranchContent = ``;
  const storyBranchContentLengthInPage = 80;

  useEffect(() => {
    setStoryRootContent("");
    if (stories.length == 0 || selectedStoryRootIndex == undefined || selectedStoryRootIndex >= stories.length) {
      return;
    }
    const story = stories[selectedStoryRootIndex];
    // access eth storage node to handle blob data
    const provider = new ethers.providers.JsonRpcProvider("http://65.108.236.27:9540");
    const contract = new ethers.Contract(story.rootContentLocation_directory, IERC5018Abi, provider);
    contract
      .read(story.rootContentLocation_name)
      .then(([content]: [string]) => {
        setStoryRootContent(ethers.utils.toUtf8String(content).replace(/[\u0000\u0020]+$/, ""));
      })
      .catch(() => {
        setStoryRootContent("Failed to load blob data from Ethereum Storage Node, please try again later.");
      });
  }, [stories, selectedStoryRootIndex]);

  useEffect(() => {
    if (!data) {
      return;
    }
    setStories(data.rootContentMinteds);
  }, [loading, data]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-violet-300 to-pink-300 font-poppins">
      <header className="w-full py-4 bg-transparent backdrop-blur-md">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold text-white text-gray-800">Logo</h1>
          <ConnectButton />
        </div>
      </header>
      <div className="flex flex-col justify-center items-center pt-4 pb-12 px-4">
        <div className="mb-4 flex justify-between items-center w-full max-w-4xl h-8">
          <div className="cursor-pointer text-white hover:text-gray-100">
            {mode == "createStoryRoot" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoots")} />}
            {mode == "viewStoryRoot" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoots")} />}
            {mode == "viewStoryBranch" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoot")} />}
            {mode == "createStoryBranch" && <MdArrowBackIos size={25} onClick={() => setMode("viewStoryRoot")} />}
          </div>
        </div>
        <div className="bg-white backdrop-blur-lg py-8 px-6 rounded-lg shadow-2xl w-full max-w-4xl mx-auto">
          {mode == "viewStoryRoots" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">View Story Roots</h2>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Roots</label>
                <div className="flex">
                  <label
                    className="block text-sm font-medium text-blue-400 underline hover:text-blue-600 cursor-pointer"
                    onClick={() => {
                      setMode("createStoryRoot");
                    }}
                  >
                    Create Root
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-2 break-all">
                {stories.map((story, index) => (
                  <div
                    key={index}
                    className="w-full p-4 rounded-lg shadow-md overflow-hidden cursor-pointer hover:bg-gray-100"
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
                      <h3 className="text-xs text-gray-600 mb-1">Story Protocol IP ID: {story.creator}</h3>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Story Root</h2>
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
                  <label className="block text-sm font-medium text-gray-700">Story Protocol License Amount</label>
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
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !creatingStoryRootName ||
                    creatingStoryRootName.length > 100 ||
                    !creatingStoryRootContent ||
                    creatingStoryRootContent.length > 10000
                  }
                  onClick={async () => {
                    if (!signer) {
                      return;
                    }

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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">View Story Root</h2>

              <div className="mb-8">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Story Root</label>
                  <div className="flex">
                    <label
                      className="block text-sm font-medium text-blue-400 underline hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        setMode("createStoryBranch");
                        window.scrollTo({
                          top: document.body.scrollHeight,
                          behavior: "smooth",
                        });
                      }}
                    >
                      Create Branch
                    </label>
                  </div>
                </div>
                <div className="w-full p-4 rounded-lg shadow-md overflow-hidden">
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-gray-600 mb-2">
                      {ethers.utils
                        .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                        .substring(
                          0,
                          ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name).length -
                            namePostfixLength
                        )}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">Creator: {stories[selectedStoryRootIndex].creator}</p>
                    <h3 className="text-xs text-gray-600 mb-1">
                      Story Protocol IP ID: {stories[selectedStoryRootIndex].creator}
                    </h3>
                    <p className="text-xs text-gray-600 mb-4">{`Content: web3://${
                      stories[selectedStoryRootIndex].rootContentLocation_directory
                    }:11155111/${ethers.utils.toUtf8String(
                      stories[selectedStoryRootIndex].rootContentLocation_name
                    )}`}</p>
                    <p className="text-sm text-gray-600">
                      {storyRootContent != "" ? storyRootContent : "Loading blob data from Ethereum Storage Node..."}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Branches</label>
                <div className="grid grid-cols-1 gap-2 break-all">
                  {storyBranches.map((storyBranche, index) => (
                    <div
                      key={index}
                      className="w-full p-4 rounded-lg shadow-md overflow-hidden cursor-pointer hover:bg-gray-100"
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">View Story Branch</h2>
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
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Story Branch</h2>
              <div className="w-full p-4 rounded-lg shadow-md overflow-hidden mb-8">
                <div className="flex flex-col">
                  <p className="text-md font-semibold text-gray-600 mb-2">
                    {ethers.utils
                      .toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name)
                      .substring(
                        0,
                        ethers.utils.toUtf8String(stories[selectedStoryRootIndex].rootContentLocation_name).length -
                          namePostfixLength
                      )}
                  </p>
                  <p className="text-xs text-gray-600 mb-1">Creator: {stories[selectedStoryRootIndex].creator}</p>
                  <h3 className="text-xs text-gray-600 mb-1">
                    Story Protocol IP ID: {stories[selectedStoryRootIndex].creator}
                  </h3>
                  <p className="text-xs text-gray-600 mb-4">{`Content: web3://${
                    stories[selectedStoryRootIndex].rootContentLocation_directory
                  }:11155111/${ethers.utils.toUtf8String(
                    stories[selectedStoryRootIndex].rootContentLocation_name
                  )}`}</p>
                  <p className="text-sm text-gray-600">
                    {storyRootContent != "" ? storyRootContent : "Loading blob data from Ethereum Storage Node..."}
                  </p>
                </div>
              </div>
              {/* <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Interaction</label>
                </div>
                <textarea
                  rows={4}
                  className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm disabled:bg-gray-200 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                  value={interactionContent}
                  onChange={(e) => {
                    setInteractionContent(e.target.value);
                  }}
                ></textarea>
              </div> */}
              <div>
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!storyRootContent}
                >
                  Start
                </button>
                {/* <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!interactionContent || interactionContent.length > 120}
                >
                  Send
                </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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
