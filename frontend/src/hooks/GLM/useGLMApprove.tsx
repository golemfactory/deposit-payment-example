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
import { TransactionExecutionError } from "viem";
import { useEffect, useState } from "react";

import debug from "debug";

const log = debug("useGLMApprove");

export function useAllowance(): {
  isFetched: boolean;
  amount?: bigint;
} {
  const chainId = useChainId();
  const { address } = useAccount();

  useEffect(() => {
    log("Read allowance");
    log("from: ", address);
    log("to contact: ", config.GLMContractAddress[chainId]);
  }, [address, chainId]);
  const {
    isFetched,
    data: allowanceAmount,
    isError,
  } = useReadContract({
    address: config.GLMContractAddress[chainId],
    abi: abi,
    functionName: "allowance",

    args: [address || `0x`, config.depositContractAddress[chainId]],
    query: {
      refetchInterval: 1000,
    },
  });

  useEffect(() => {
    log("Allowance amount: ", allowanceAmount);
    log("isFetched: ", isFetched);
    log("isError: ", isError);
  }, [allowanceAmount, isFetched]);
  return {
    isFetched,
    amount: allowanceAmount,
  };
}

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
    isSuccess,
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
            val || balance.data?.value || 0n,
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
    isSuccess,
  };
}
