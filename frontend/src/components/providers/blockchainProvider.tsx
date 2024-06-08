import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { SIWECreateMessageArgs, createSIWEConfig, formatMessage } from "@web3modal/siwe";
import { SiweMessage } from "siwe";

import { WagmiProvider, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { config } from "config";
import { holesky } from "viem/chains";
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
  transports: {
    [holesky.id]: http(),
  },
  metadata,
});




function createMessage({ nonce, address, chainId }: any) {
  console.log('creating message '); 
  console.log('nonce', nonce);
  console.log('address', address);
  console.log('chainId', chainId);
  const message = new SiweMessage({
    version: "1",
    domain: window.location.host,
    uri: window.location.origin,
    address,
    chainId,
    nonce: nonce.toString(),
    statement: "Sign in with ethereum",
  });
console.log("message", message);
console.log("message.prepareMessage()", message.prepareMessage());
  return message.prepareMessage();
}

// const siweConfig = createSIWEConfig({
//   getMessageParams,
//   getNonce,
//   getSession,
//   verifyMessage,
//   signOut
// })

async function getMessageParams(){
  return {
    domain: window.location.host,
    uri: window.location.origin,
    chains: [1, 2020],
    statement: 'Please sign with your account'
  }
}
// // @ts-ignore
const siweConfig = createSIWEConfig({
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) => formatMessage(args, address),
  getMessageParams,
  getNonce: async (address) => {
    if (!address) {
      throw new Error("Address is required");
    }
    localStorage.setItem("address", address);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_HTTP_URL}/register`,
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

    console.log("nonce", responseData.nonce.toString());
    return responseData.nonce.toString();
  },
  // @ts-ignore
  async getSession() {
    return new Promise((resolve) => setTimeout( ()=> {
      resolve({
        // @ts-ignore
        address: localStorage.getItem("address"),
        chainId: 1,
    })}, 1000));  
  },
  verifyMessage: async ({ message, signature }) => {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_HTTP_URL}/login`, {
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

    window.dispatchEvent(new StorageEvent("storage", { key : 'accessToken', newValue : data.accessToken }));


    return true;
  },
  signOut: async () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("address");
    
    return false;
  }
});

createWeb3Modal({
  wagmiConfig,
  projectId: config.projectId,
  siweConfig,
  tokens: {
    [holesky.id]: {
      address: config.GLMContractAddress[holesky.id],
      image: "./favicon.svg", //optional
    },
  },
  themeMode: "light",
  themeVariables: {
    "--w3m-font-family": "Kanit",
    "--w3m-accent": "#181ea9",
    "--w3m-border-radius-master": "1px",
    "--w3m-font-size-master": "0.7rem",
  },
});

export function BlockchainProvider({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
