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
    [holesky.id]: "0xb9919c8D8D384d93C195503064A3b303Ea8Fdbaa",
  },
  GLMContractAddress: {
    [holesky.id]: "0x8888888815bf4db87e57b609a50f938311eed068",
  },
  requestorWalletAddress: {
    [holesky.id]: "0x047b7a753dfd1e6f9e64e24e1d8450e55887e892",
  },
  minimalAllowance: parseEther("100"),
};
