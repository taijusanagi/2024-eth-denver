"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MdArrowBackIos } from "react-icons/md";

import { useAccount, useWriteContract } from "wagmi";
import { useEthersSigner } from "@/lib/ethers";
import { ethers } from "ethers";
import { contentNFTAbi, contentNFTAddress } from "@/lib/contracts";

// content name is modified in backend like ${name}-1709156261098.txt
// so this can be removed in frontend for better display
const namePrefixLength = 18;
const defaultPolicyId = 1;
const defaultLicenseAmount = 100;

export default function CreatorPage() {
  const { address: connectedAddress } = useAccount();
  const signer = useEthersSigner();
  const { writeContract, error, data } = useWriteContract();

  const [mode, setMode] = useState<
    "viewStoryRoots" | "createStoryRoot" | "viewStoryRoot" | "viewStoryBranch" | "createStoryBranch"
  >("viewStoryRoots");
  const [forkedFrom, setForkedFrom] = useState<number>();
  const [stories, setStories] = useState([
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
  ]);
  const [selectedStoryRootIndex, setSelectedStoryRootIndex] = useState<number>();
  const [storyBranches, setStoryBranches] = useState([
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
    "https://placehold.jp/500x500.png",
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
  const storyBranchContent = ``;
  const storyBranchContentLengthInPage = 80;

  useEffect(() => {
    if (!error) {
      return;
    }
    console.log(error);
  }, [error]);

  useEffect(() => {
    if (!data) {
      return;
    }
    console.log(data);
  }, [data]);

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
          <div className="cursor-pointer text-white hover:text-gray-200">
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
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
                {stories.map((story, index) => (
                  <div
                    key={index}
                    className="w-full h-30 bg-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition duration-100"
                    onClick={() => {
                      setSelectedStoryRootIndex(index);
                      setMode("viewStoryRoot");
                    }}
                  >
                    <img src={story} alt={`Story ${index + 1}`} className="w-full h-full object-cover" />
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
              <div className="mb-4">
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">Story Root</label>
                  <div className="flex">
                    <label
                      className="block text-sm font-medium text-blue-400 underline hover:text-blue-600 cursor-pointer"
                      onClick={() => {
                        setMode("createStoryBranch");
                      }}
                    >
                      Create Branch
                    </label>
                  </div>
                </div>
                <div className="w-full h-80 mt-2">
                  <img src={stories[selectedStoryRootIndex]} className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Story Branches</label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-4">
                  {stories.map((story, index) => (
                    <div
                      key={index}
                      className="w-full h-30 bg-gray-200 rounded-lg shadow-md overflow-hidden cursor-pointer transform hover:scale-105 transition duration-100"
                      onClick={() => {
                        setSelectedStoryBranchIndex(index);
                        setMode("viewStoryBranch");
                      }}
                    >
                      <img src={story} alt={`Story ${index + 1}`} className="w-full h-full object-cover" />
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
          {mode == "createStoryBranch" && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Story Branch</h2>
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
