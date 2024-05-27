import { createPublicClient, http } from "viem";
import { holesky } from "viem/chains";
import { abi } from "./abi.js";
import BigDecimal from "js-big-decimal";
import { Deposit, DepositData } from "../user/types.js";
import { container } from "../../di.js";

export const publicClient = createPublicClient({
  chain: holesky,
  transport: http(),
});

export const paymentService = (
  contractAddress: `0x${string}`,
  serviceFee: string
) => {
  return {
    getDeposit: async (
      nonce: bigint,
      walletAddress: `0x${string}`
    ): Promise<DepositData> => {
      // @ts-ignore
      return publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getDepositByNonce",
        args: [BigInt(nonce), walletAddress],
      });
    },
    saveDeposit: async (userId: string, nonce: string, id: string) => {
      const userService = container.cradle.userService;
      const documentDeposit = {
        nonce: BigInt(nonce),
        isCurrent: true,
        id: id,
      };
      userService.addDeposit(userId, documentDeposit);
    },
  };
};
