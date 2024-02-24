"use client";

import { Inter } from "next/font/google";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [mode, setMode] = useState<"bid">("bid");
  const [assetImage, setAssetIpImage] = useState("https://placehold.jp/500x500.png");

  return (
    <main
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-700 to-gray-950 font-poppins ${inter.className}`}
    >
      <header className="w-full py-4 bg-transparent backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold text-white">Auction</h1>
          <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Connect Wallet
          </button>
        </div>
      </header>
      <div className="flex flex-col justify-center items-center py-12 px-4">
        <div className="mb-4 flex justify-end items-center w-full max-w-sm">
          <nav className="flex space-x-4 text-white">
            <button
              className={`p-2 text-sm sm:text-base ${
                mode == "bid" ? "text-purple-600 font-semibold border-b-2 border-purple-600" : ""
              }`}
              onClick={() => setMode("bid")}
            >
              Bid
            </button>
          </nav>
        </div>
        <div className="bg-transparent backdrop-blur-lg py-8 px-6 rounded-lg shadow-2xl w-full max-w-sm mx-auto space-y-6">
          {mode == "bid" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-100 mb-4">Bid</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Image
                  </label>
                  <img
                    src={assetImage}
                    alt="Combined IP Image"
                    className="mt-1 max-w-full h-auto rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Current Price
                  </label>
                  <input
                    type="text"
                    disabled
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    value={"1ETH"}
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Bid Price
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
                      // setIsModalOpen(true);
                    }}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
