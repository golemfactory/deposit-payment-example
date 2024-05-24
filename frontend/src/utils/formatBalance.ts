import { formatEther } from "viem";
export const formatBalance = (rawBalance: bigint) => {
  return parseFloat(formatEther(rawBalance)).toFixed(2);
};
