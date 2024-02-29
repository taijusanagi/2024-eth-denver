"use client";

import React from "react";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

const config = getDefaultConfig({
  appName: "App",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || "",
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>{children} </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
