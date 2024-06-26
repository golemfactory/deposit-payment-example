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
import { parseEther } from "viem";
import { useRequestorWalletAddress } from "hooks/useRequestorWalletAddress";
import { useHandleRpcError } from "hooks/useHandleRpcError";
import dayjs from "dayjs";
import { useDepositCreatedEvents } from "hooks/events/useDepositCreatedEvents";
import { useDepositExtendedEvents } from "hooks/events/useDepositExtendedEvents";
import { ZERO_ADDRESS } from "types/zero";

export function useCreateDeposit() {
  const {
    data,
    isIdle,
    writeContractAsync,
    error,
    isPending: isWaitingForUserAcceptance,
  } = useWriteContract();

  const chainId = useChainId();
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(
    dayjs().add(1, "day").unix()
  );
  const nonce = useRef(Math.floor(Math.random() * 1000000));
  const { data: requestorData } = useRequestorWalletAddress();
  const { showNotification, errorContext } = useHandleRpcError();

  const {
    isSuccess,
    isError,
    isLoading: isWaitingForReceipt,
    isPending,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { emit } = useDepositCreatedEvents();

  useEffect(() => {
    if (isSuccess && data) {
      emit({
        txHash: data,
        amount: amount,
        fee: fee,
        validityTimestamp: validToTimestamp,
      });
    }
  }, [isSuccess, data]);

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

    error,
    setFee,
    isPending,
    isSuccess,
    isError,
    isLoading: isWaitingForReceipt || isWaitingForUserAcceptance,
    isIdle,
    setValidToTimestamp,
    validToTimestamp,
    depositId: (contractSimulationData?.result as any)?.toString(),
    nonce: nonce.current,
    setAmount,
    errorContext,
  };
}

export function useUserCurrentDeposit() {
  const { user } = useUser();

  const { data, isError, isSuccess, isPending } = useReadContract({
    address: config.depositContractAddress[useChainId()],
    abi: abi,
    functionName: "deposits",
    //@ts-ignore
    args: [BigInt(user?.currentDeposit?.id || 0) || 0n],
    query: {
      refetchInterval: 1000,
    },
  });

  return {
    ...(data?.[0] === ZERO_ADDRESS
      ? {
          amount: undefined,
          flatFeeAmount: undefined,
          validToTimestamp: undefined,
        }
      : {
          amount: data?.[1],
          flatFeeAmount: data?.[2],
          validToTimestamp: data?.[3],
        }),
    isError,
    isSuccess,
    isPending,
  };
}

export function useExtendDeposit() {
  const { emit } = useDepositExtendedEvents();
  const { showNotification, errorContext } = useHandleRpcError();

  const { data, isError, isSuccess, writeContractAsync, isPending } =
    useWriteContract();

  const {
    isSuccess: isSuccessTransaction,
    isError: isErrorTransaction,
    isLoading: isLoadingTransaction,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  useEffect(() => {
    if (isSuccessTransaction && data) {
      emit({
        txHash: data,
        amount: additionalAmount,
        fee: additionalFee,
        validityTimestamp: validToTimestamp,
      });
    }
  }, [isSuccessTransaction]);

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
    isSuccess: isSuccessTransaction,
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
