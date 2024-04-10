import { useAccount, useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { assertBigInt, assertOptionalBigInt } from "types/assertBigInt";
import { parseEther } from "viem";
import { useEffect } from "react";
import { is } from "ramda";

export function useAllowance(): {
  isFetched: boolean;
  data?: bigint;
  isLoading: boolean;
} {
  const chainId = useChainId();
  const { address } = useAccount();

  const { isFetched, isFetching, isLoading, data, refetch } = useReadContract({
    address: config.GLMContractAddress[chainId],
    abi: abi,
    functionName: "allowance",
    args: [address, config.requestorWalletAddress[chainId]],
  });

  useEffect(() => {
    if (!isFetching) {
      setTimeout(() => {
        const result = refetch();
      }, 2000);
    }
  }, [isFetching]);

  assertOptionalBigInt(data);

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
        args: [config.requestorWalletAddress[chainId], parseEther("100")],
      });
      return result;
    },
  };
}
