import {
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";

import { abi } from "./abi";
import { useEffect, useRef, useState } from "react";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { useUser } from "hooks/useUser";
import { useAccount } from "wagmi";
import { formatEther, parseEther } from "viem";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";
import { set } from "ramda";
import { string } from "ts-pattern/dist/patterns";
export function useCreateDeposit() {
  const {
    data,
    isError,
    isSuccess,
    isPending,
    isIdle,
    writeContractAsync,
    error,
  } = useWriteContract();
  const chainId = useChainId();
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(0);
  const nonce = useRef(Math.floor(Math.random() * 1000000));
  const { data: requestorData } = useRequestorWalletAddress();

  const { data: contractSimulationData } = useSimulateContract({
    address: config.depositContractAddress[chainId],
    abi: abi,
    functionName: "createDeposit",
    args: [
      BigInt(nonce.current),
      requestorData?.wallet || "0x",
      BigInt(1 * Math.pow(10, 18)),
      BigInt(1 * Math.pow(10, 18)),
      BigInt(validToTimestamp),
    ],
  });

  return {
    createDeposit: async () => {
      if (!requestorData?.wallet) {
        throw new Error("Requestor data not found");
      }
      const writeResult = await writeContractAsync({
        address: config.depositContractAddress[chainId],
        abi: abi,
        functionName: "createDeposit",

        //         { internalType: "uint64", name: "nonce", type: "uint64" },
        // { internalType: "address", name: "spender", type: "address" },
        // { internalType: "uint128", name: "amount", type: "uint128" },
        // { internalType: "uint128", name: "flatFeeAmount", type: "uint128" },
        // { internalType: "uint64", name: "validToTimestamp", type: "uint64" },
        args: [
          BigInt(nonce.current),
          requestorData?.wallet,
          BigInt(amount * Math.pow(10, 18)),
          BigInt(fee * Math.pow(10, 18)),
          BigInt(validToTimestamp),
        ],
      });

      return {
        nonce: nonce.current,
        depositId: (contractSimulationData?.result as any)?.toString(),
      };
    },
    data,
    isError,
    isSuccess,
    error,
    setFee,
    isPending,
    isIdle,
    setValidToTimestamp,
    setAmount,
  };
}

export function useUserCurrentDeposit() {
  const { user } = useUser();

  const { data, refetch, isFetching, isError, isSuccess, isPending } =
    useReadContract({
      address: config.depositContractAddress[useChainId()],
      abi: abi,
      functionName: "deposits",
      //@ts-ignore
      args: [BigInt(user?.currentDeposit?.id || 0) || 0n],
      query: {
        refetchInterval: 10000,
      },
    });

  return {
    amount: formatEther(data ? data[1] : 0n),
    flatFeeAmount: formatEther(data ? data[2] : 0n),
    validToTimestamp: Number(data ? data[3] : 0n),
    isError,
    isSuccess,
    isPending,
    isFetching,
  };
}

export function useExtendDeposit() {
  const { data, isError, isSuccess, writeContractAsync, isPending } =
    useWriteContract();
  const chainId = useChainId();
  const [validToTimestamp, setNewValidToTimestamp] = useState(
    new Date().getTime() / 1000
  );
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [nonce, setNonce] = useState(0n);
  return {
    extendDeposit: async () => {
      await writeContractAsync({
        address: config.depositContractAddress[chainId],
        abi: abi,
        functionName: "extendDeposit",
        args: [
          BigInt(nonce),
          parseEther(additionalAmount.toString()),
          parseEther(additionalFee.toString()),
          BigInt(validToTimestamp),
        ],
      });
    },
    data,
    isError,
    isSuccess,
    isPending,
    newValidToTimeStamp: validToTimestamp,
    setNewValidToTimestamp,
    setNonce,
    setAdditionalAmount,
    setAdditionalFee,
    additionalAmount,
    additionalFee,
    validToTimestamp,
  };
}
