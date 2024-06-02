import { formatEther } from "viem";
export const formatBalance = (rawBalance: bigint | number) => {
  return parseFloat(formatEther(BigInt(rawBalance))).toFixed(2);
};
