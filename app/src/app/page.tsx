"use client";

import React, { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { MdArrowBackIos } from "react-icons/md";

export default function CreatorPage() {
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
  const storyBranchContent = ``;
  const storyBranchContentLengthInPage = 80;

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
                <div className="flex justify-between">
                  <label className="block text-sm font-medium text-gray-700">Prompt</label>
                </div>
                <textarea className="h-[45vh] mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"></textarea>
              </div>
              <div>
                <button
                  className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                  onClick={() => {
                    setIsModalOpen(true);
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
