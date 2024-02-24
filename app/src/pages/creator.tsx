import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen flex flex-col bg-gradient-to-br from-violet-200 to-pink-200 font-poppins ${inter.className}`}
    >
      Creator
    </main>
  );
}
