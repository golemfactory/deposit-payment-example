import { useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { useState } from "react";
import { config } from "config";
import { useChainId } from "wagmi";

export function useDeposit() {
  const { data, isError, isSuccess, writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(0);
  return {
    createDeposit: async () => {
      const nonce = Math.floor(Math.random() * 1000000);
      const result = await writeContractAsync({
        //@ts-ignore TODO : make sure only supportwed chains are allowed
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
