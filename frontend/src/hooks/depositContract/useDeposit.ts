import { useReadContract, useSimulateContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { useRef, useState } from "react";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { useUser } from "hooks/useUser";
import { formatEther, parseEther } from "viem";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";
import { useHandleRpcError } from "hooks/useHandleRpcError";
import dayjs from "dayjs";
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
  const { showNotification, errorContext } = useHandleRpcError();
  const { data: contractSimulationData, error: simulationError } =
    useSimulateContract({
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
      try {
        await writeContractAsync({
          address: config.depositContractAddress[chainId],
          abi: abi,
          functionName: "createDeposit",
          args: [
            BigInt(nonce.current),
            requestorData?.wallet,
            BigInt(amount * Math.pow(10, 18)),
            BigInt(fee * Math.pow(10, 18)),
            BigInt(validToTimestamp),
          ],
        });
      } catch (e) {
        showNotification(e);
      }

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
    depositId: (contractSimulationData?.result as any)?.toString(),
    nonce: nonce.current,
    setAmount,
    errorContext,
  };
}

export function useUserCurrentDeposit() {
  const { user } = useUser();

  const { data, isFetching, isError, isSuccess, isPending } = useReadContract({
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
  const { showNotification, errorContext } = useHandleRpcError();

  const { data, isError, isSuccess, writeContractAsync, isPending } =
    useWriteContract();
  const chainId = useChainId();
  const [validToTimestamp, setNewValidToTimestamp] = useState(
    dayjs().add(1, "day").unix()
  );
  const [additionalAmount, setAdditionalAmount] = useState(0);
  const [additionalFee, setAdditionalFee] = useState(0);
  const [nonce, setNonce] = useState(0n);
  return {
    extendDeposit: async () => {
      try {
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
      } catch (e) {
        showNotification(e);
      }
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
    errorContext,
  };
}
