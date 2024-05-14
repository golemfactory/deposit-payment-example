import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { createSIWEConfig } from "@web3modal/siwe";
import { SiweMessage } from "siwe";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { config } from "config";
const queryClient = new QueryClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com",
  icons: ["./logo.svg"],
};

const wagmiConfig = defaultWagmiConfig({
  chains: config.supportedChains,
  projectId: config.projectId,
  metadata,
});

function createMessage({ nonce, address, chainId }: any) {
  const message = new SiweMessage({
    version: "1",
    domain: window.location.host,
    uri: window.location.origin,
    address,
    chainId,
    nonce: nonce.toString(),
    statement: "Sign in with ethereum",
  });

  return message.prepareMessage();
}

const siweConfig = createSIWEConfig({
  createMessage,
  getNonce: async (address) => {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: address }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error registering user: ${response.statusText}`);
    }
    const responseData = await response.json();

    return responseData.nonce.toString();
  },
  getSession: async () => {
    return {
      address: "0x8e2A131F99b4Dce031D3BceEb67b632c4d6C12fF",
      chainId: 1700,
    };
  },
  verifyMessage: async ({ message, signature }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, signature }),
    });

    if (!res.ok) {
      throw new Error(`Error logging in: ${res.statusText}`);
    }

    const data = await res.json();

    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);

    return true;
  },
  signOut: async () => {
    return true;
  },
  signOutOnNetworkChange: true,
});

createWeb3Modal({
  wagmiConfig,
  projectId: config.projectId,
  siweConfig,
  themeVariables: {
    "--w3m-font-family": "Kanit-Light",
    "--w3m-accent": "#181ea9a6",
    "--w3m-border-radius-master": "5px",
    "--w3m-font-size-master": "0.9rem",
  },
});

export function BlockchainProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
