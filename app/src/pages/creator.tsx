import { Inter } from "next/font/google";
import { ReactNode, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [mode, setMode] = useState<"createIp" | "combineIp" | "detail">("createIp");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdIpImage, setCreatedIpImage] = useState("https://placehold.jp/500x500.png");
  const [firstIpImage, setFirstIpImage] = useState("https://placehold.jp/500x500.png");
  const [secondIpImage, setSecondIpImage] = useState("https://placehold.jp/500x500.png");
  const [combinedIpImage, setCombinedIpImage] = useState("https://placehold.jp/500x500.png");
  const [detailIpImage, setDetailIpImage] = useState("https://placehold.jp/500x500.png");

  const childIps = [
    {
      image: "https://placehold.jp/500x500.png",
    },
    {
      image: "https://placehold.jp/500x500.png",
    },
    {
      image: "https://placehold.jp/500x500.png",
    },
    {
      image: "https://placehold.jp/500x500.png",
    },
    {
      image: "https://placehold.jp/500x500.png",
    },
    {
      image: "https://placehold.jp/500x500.png",
    },
  ];

  return (
    <main
      className={`min-h-screen flex flex-col bg-gradient-to-br from-violet-200 to-pink-200 font-poppins ${inter.className}`}
    >
      <header className="w-full py-4 bg-white backdrop-blur-md shadow-md">
        <div className="flex justify-between items-center px-4">
          <h1 className="text-xl font-semibold text-gray-800">Creator Tool</h1>
          <button className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none">
            Connect Wallet
          </button>
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
        <div className="bg-white backdrop-blur-lg p-8 rounded-lg shadow-2xl w-full max-w-xl mx-auto space-y-6">
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
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
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
                    onClick={() => setIsModalOpen(false)}
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
                  {/* Child IPs List using Grid */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Child IPs</label>
                    <div className="grid grid-cols-4 gap-4">
                      {childIps.map((childIp, index) => (
                        <div key={index} className="col-span-1">
                          <img
                            src={childIp.image}
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
