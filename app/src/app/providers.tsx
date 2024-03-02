"use client";

import React from "react";

import { RainbowKitProvider, getDefaultConfig, lightTheme } from "@rainbow-me/rainbowkit";

import { WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/apollo-client";

import { LivepeerConfig, createReactClient, studioProvider } from "@livepeer/react";

const client = createReactClient({
  provider: studioProvider({ apiKey: "519fd658-af78-4dcc-9fe4-46745ea5d65c" }),
});

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
        <RainbowKitProvider
          theme={lightTheme({
            accentColor: "#4F46E5",
            borderRadius: "medium",
          })}
        >
          <ApolloProvider client={apolloClient}>
            <LivepeerConfig client={client}>{children}</LivepeerConfig>
          </ApolloProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
