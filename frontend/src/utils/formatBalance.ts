import { formatEther } from "viem";
export const formatBalance = (rawBalance: bigint | number) => {
  return rawBalance !== undefined && rawBalance !== null
    ? parseFloat(formatEther(BigInt(rawBalance))).toFixed(2)
    : "";
};
