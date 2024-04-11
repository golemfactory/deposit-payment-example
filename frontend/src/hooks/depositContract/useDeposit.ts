import { useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { useState } from "react";
import { config } from "config";
import { useChainId } from "hooks/useChainId";
import { useUser } from "hooks/useUser";
import { useAccount } from "wagmi";
export function useCreateDeposit() {
  const { data, isError, isSuccess, writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(0);

  return {
    createDeposit: async () => {
      const nonce = Math.floor(Math.random() * 1000000);
      await writeContractAsync({
        address: config.depositContractAddress[chainId],
        abi: abi,
        functionName: "createDeposit",
        args: [
          BigInt(nonce),
          //@ts-ignore TODO : make sure only supportwed chains are allowed
          config.requestorWalletAddress[chainId],
          BigInt(amount * Math.pow(10, 18)),
          BigInt(fee * Math.pow(10, 18)),
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
    setValidToTimestamp,
    setAmount,
  };
}

export function useUserCurrentDeposit() {
  const { user } = useUser();
  const { address } = useAccount();

  if (!address) {
    throw new Error("No account found");
  }
  if (!user.currentDeposit) {
    throw new Error("No deposit found");
  }

  return useReadContract({
    address: config.depositContractAddress[useChainId()],
    abi: abi,
    functionName: "getDeposit2",
    args: [user.currentDeposit.nonce || BigInt(0), address],
  });
}
