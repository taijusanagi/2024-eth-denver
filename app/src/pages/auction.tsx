import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen flex flex-col bg-gradient-to-br from-gray-700 to-gray-950 font-poppins ${inter.className}`}
    >
      Action
    </main>
  );
}
