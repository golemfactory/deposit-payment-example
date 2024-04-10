import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { config } from "config";
const queryClient = new QueryClient();

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

createWeb3Modal({
  wagmiConfig,
  projectId: config.projectId,
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
