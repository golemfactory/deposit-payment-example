import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";
import { abi } from "./abi.js";
import BigDecimal from "js-big-decimal";

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http(),
});

export const paymentService = (
  contractAddress: `0x${string}`,
  serviceFee: string
) => {
  return {
    saveDeposit: async ({
      nonce,
      funder,
    }: {
      nonce: number;
      funder: `0x${string}`;
    }) => {
      const data = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getDeposit2",
        args: [BigInt(nonce), funder],
      });

      const { amount, feeAmount } = data;

      const feeRation = Number(BigDecimal.default.divide(feeAmount, amount));

      console.log("feeRation", feeRation);
      console.log("serviceFee", serviceFee);
      console.log("amount", amount);
      if (feeRation < Number(serviceFee)) {
        return {
          result: false,
        };
      } else {
        return {
          result: true,
        };
      }
    },
  };
};
