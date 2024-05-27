import {
  useAccount,
  useBalance,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { abi } from "./abi";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { assertOptionalBigInt } from "types/assertBigInt";
import { TransactionExecutionError } from "viem";
import { useEffect, useState } from "react";

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
    args: [address, config.depositContractAddress[chainId]],
  });

  useEffect(() => {
    if (!isFetching) {
      setTimeout(() => {
        const result = refetch();
      }, 10000);
    }
  }, [isFetching]);

  assertOptionalBigInt(data);

  return { isFetched, data, isLoading: isFetching || isLoading };
}
4;

export function useApprove() {
  const {
    writeContractAsync,
    //rep
    isPending,
    isError: isPrepError,
    error: prepError,
  } = useWriteContract();
  const chainId = useChainId();
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const { address } = useAccount();
  const balance = useBalance({
    address,
    token: config.GLMContractAddress[chainId],
  });
  const {
    error: txError,
    isLoading,
    isError: isTxError,
    data: txData,
  } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  return {
    approve: async (val?: bigint) => {
      try {
        const hash = await writeContractAsync({
          address: config.GLMContractAddress[chainId],
          abi: abi,
          functionName: "approve",
          args: [
            config.depositContractAddress[chainId],
            val || balance.data?.value,
          ],
        });
        setTxHash(hash);
      } catch (e) {
        //There is no option in viewm/wagmi to detect if the error is due to user rejection
        //https://github.com/wevm/viem/discussions/2113
        console.error(e instanceof TransactionExecutionError);
      }
    },
    isError: isPrepError || isTxError,
    error: {
      prepError,
      txError,
    },
    isProcessing: isPending || isLoading,
    approveData: txData,
  };
}
