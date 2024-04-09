import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { assertBigInt } from "types/assertBigInt";

export function useAllowance(): {
  isFetched: boolean;
  data?: BigInt;
  isLoading: boolean;
} {
  const chainId = useChainId();
  const { address } = useAccount();

  const { isFetched, isFetching, isLoading, data } = useReadContract({
    address: config.GLMContractAddress[chainId],
    abi: abi,
    functionName: "allowance",
    args: [address, config.requestorWalletAddress[chainId]],
  });

  assertBigInt(data);

  return { isFetched, data, isLoading: isFetching || isLoading };
}

export function useApprove() {
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const { address } = useAccount();

  return {
    approve: async () => {
      const result = await writeContractAsync({
        address: config.GLMContractAddress[chainId],
        abi: abi,
        functionName: "approve",
        args: [config.requestorWalletAddress[chainId], BigInt(2 ** 256 - 1)],
      });
      return result;
    },
  };
}
