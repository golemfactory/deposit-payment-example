import { useReadContract, useWriteContract } from "wagmi";

import { abi } from "./abi";
import { useState } from "react";
import { createPublicClient, http } from "viem";
import { mainnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

export function useDeposit() {
  const { data, isError, isSuccess, writeContract, writeContractAsync } =
    useWriteContract();

  const [fee, setFee] = useState(0);
  const [amount, setAmount] = useState(0);
  const [validToTimestamp, setValidToTimestamp] = useState(0);
  return {
    createDeposit: async () => {
      const nonce = Math.floor(Math.random() * 1000000);
      const result = await writeContractAsync({
        address: "0xb9919c8D8D384d93C195503064A3b303Ea8Fdbaa",
        abi: abi,
        functionName: "createDeposit",
        args: [
          BigInt(nonce),
          "0x047b7a753dfd1e6f9e64e24e1d8450e55887e892",
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
