import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-700 to-gray-950 font-poppins ${inter.className}`}
    >
      <div className="flex flex-col justify-center items-center py-12">
        <div className="bg-transparent backdrop-blur-lg p-10 rounded-lg shadow-2xl w-full max-w-xl mx-auto space-y-6"></div>
      </div>
    </main>
  );
}
