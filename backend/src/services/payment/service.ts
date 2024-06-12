import { createPublicClient, formatEther, http } from "viem";
import { holesky } from "viem/chains";
import { abi } from "./abi.js";
import { DepositData } from "../user/types.js";
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
    getDeposit: async (id: bigint): Promise<DepositData> => {
      return new Promise(async (resolve, reject) => {
        const deposit = await publicClient.readContract({
          address: contractAddress,
          abi: abi,
          functionName: "deposits",
          args: [id],
        });
        resolve({
          amount: deposit[1],
          feeAmount: deposit[2],
          validTo: deposit[3],
          spender: deposit[0],
          id: id,
        });
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
