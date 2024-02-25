"use client";

import React, { useMemo, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function CreatorPage() {
  const [mode, setMode] = useState<"createStory" | "viewStories">("createStory");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [forkedFrom, setForkedFrom] = useState("");

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-violet-200 to-pink-200 font-poppins">
      <header className="w-full py-4 bg-white backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold text-gray-800">Creator Tool</h1>
          <ConnectButton />
        </div>
      </header>
      <div className="flex flex-col justify-center items-center py-12 px-4">
        <div className="mb-4 flex justify-end items-center w-full max-w-2xl">
          <nav className="flex space-x-4 text-white">
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "createStory" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("createStory")}
            >
              Create Story
            </button>
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "viewStories" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("viewStories")}
            >
              View Stories
            </button>
          </nav>
        </div>
        <div className="bg-white backdrop-blur-lg py-8 px-6 rounded-lg shadow-2xl w-full max-w-2xl mx-auto space-y-6">
          {mode == "createStory" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Create Story</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between">
                    <label className="block text-sm font-medium text-gray-700">Prompt</label>
                    {forkedFrom && (
                      <label
                        className="block text-sm font-medium text-blue-400 underline hover:text-blue-600 cursor-pointer"
                        onClick={() => {
                          console.log("clicked");
                        }}
                      >
                        Forked from story: {forkedFrom}
                      </label>
                    )}
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
            </div>
          )}
          {mode == "viewStories" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800  mb-4">View Stories</h2>
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
