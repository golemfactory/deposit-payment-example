import { parseEther } from "viem";
import { holesky, polygon } from "viem/chains";

type Chain = { id: number };

type Config<Chains extends Chain[]> = {
  supportedChains: Chains;
  projectId: string;
  depositContractAddress: {
    [Key in Chains[number]["id"]]: `0x${string}`;
  };
  GLMContractAddress: {
    [Key in Chains[number]["id"]]: `0x${string}`;
  };
  requestorWalletAddress: {
    [Key in Chains[number]["id"]]: `0x${string}`;
  };
  minimalAllowance: bigint;
};

export const config: Config<[typeof holesky]> = {
  supportedChains: [holesky] as const,
  projectId: "20bd2ed396d80502980b6d2a3fb425f4",
  depositContractAddress: {
    [holesky.id]: "0x7167E731b0031d4326d46C8D1E1c2E111227aB5f",
  },
  GLMContractAddress: {
    [holesky.id]: "0x8888888815bf4db87e57b609a50f938311eed068",
  },
  requestorWalletAddress: {
    [holesky.id]: import.meta.env
      .VITE_REQUESTOR_WALLET_ADDRESS as `0x${string}`,
  },
  minimalAllowance: parseEther("10"),
};
