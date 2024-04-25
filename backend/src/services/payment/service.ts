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
      walletAddress: string
    ): Promise<DepositData> => {
      // @ts-ignore
      return publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getDepositByNonce",
        args: [BigInt(nonce), walletAddress],
      });
    },
    saveDeposit: async (userId: string, nonce: string) => {
      const userService = container.cradle.userService;
      const user = await userService.findById(userId);
      if (!user) {
        throw new Error(`User not found with id ${userId}`);
      }

      const data = await publicClient.readContract({
        address: contractAddress,
        abi: abi,
        functionName: "getDepositByNonce",
        args: [BigInt(nonce), user.walletAddress],
      });
      if (!data) {
        throw new Error(
          `Deposit not found with nonce ${nonce} and funder ${user.walletAddress}`
        );
      }
      // @ts-ignore
      const { amount, feeAmount } = data;

      const feeRatio = Number(BigDecimal.default.divide(feeAmount, amount));
      const documentDeposit = {
        nonce: BigInt(nonce),
        isCurrent: true,
        isValid: true,
      };

      if (feeRatio < Number(serviceFee)) {
        documentDeposit.isValid = false;
      }
      userService.addDeposit(userId, documentDeposit);
    },
  };
};
