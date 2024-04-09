import { useChainId as useChainIdWagmi } from "wagmi";
import { config } from "config";

type SupportedChainId = (typeof config.supportedChains)[number]["id"];

export const useChainId = (): SupportedChainId => {
  const chainId = useChainIdWagmi();
  if (!config.supportedChains.some((chain) => chain.id === chainId)) {
    throw new Error("Unsupported chain");
  }
  return chainId as SupportedChainId;
};
