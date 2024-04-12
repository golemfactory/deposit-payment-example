import { parseEther } from "viem";
import { holesky } from "viem/chains";

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
    [holesky.id]: "0xA3D86ebF4FAC94114526f4D09C3fA093898347a6",
  },
  GLMContractAddress: {
    [holesky.id]: "0x8888888815bf4db87e57b609a50f938311eed068",
  },
  requestorWalletAddress: {
    [holesky.id]: "0xc6b6818d452e4c821d32423677092316a6b705e7",
  },
  minimalAllowance: parseEther("50"),
};
