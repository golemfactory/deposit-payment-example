import { useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { useEffect, useState } from "react";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { useUser } from "hooks/useUser";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";
export function useCreateDeposit() {
  const { data, isError, isSuccess, isPending, isIdle, writeContractAsync } =
    useWriteContract();
  const chainId = useChainId();
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(0);

  const { data: requestorData } = useRequestorWalletAddress();

  return {
    createDeposit: async () => {
      const nonce = Math.floor(Math.random() * 1000000);
      console.log("c", config.depositContractAddress[chainId], requestorData);
      await writeContractAsync({
        address: config.depositContractAddress[chainId],
        abi: abi,
        functionName: "createDeposit",
        args: [
          BigInt(nonce),
          requestorData?.wallet,
          BigInt(amount * Math.pow(10, 18)),
          BigInt(fee * Math.pow(10, 18)),
          BigInt(0),
          BigInt(validToTimestamp),
        ],
      });

      return {
        nonce,
      };
    },
    data,
    isError,
    isSuccess,
    setFee,
    isPending,
    isIdle,
    setValidToTimestamp,
    setAmount,
  };
}

export function useUserCurrentDeposit() {
  const { user } = useUser();
  const { address } = useAccount();

  const { data, refetch, isFetching } = useReadContract({
    address: config.depositContractAddress[useChainId()],
    abi: abi,
    functionName: "getDepositByNonce",
    args: [user?.currentDeposit?.nonce || BigInt(0), address],
  });

  useEffect(() => {
    if (!isFetching) {
      const timeout = setTimeout(() => {
        refetch();
      }, 1000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isFetching]);

  return { data } as {
    data: {
      amount: bigint;
      feeAmount: bigint;
      validTo: bigint;
    };
    isError: boolean;
    isSuccess: boolean;
    isPending: boolean;
  };
}

export function useExtendDeposit() {
  const { data, isError, isSuccess, writeContractAsync, isPending } =
    useWriteContract();
  const chainId = useChainId();
  const [validToTimestamp, setNewValidToTimestamp] = useState(0);
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
