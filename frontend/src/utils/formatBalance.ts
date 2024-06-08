import { formatEther } from "viem";
export const formatBalance = (rawBalance?: bigint | number) => {
  console.log("rawBalance", rawBalance);  
  if (rawBalance === undefined || rawBalance === null) {
    return "";
  }
  return rawBalance !== undefined && rawBalance !== null
    ? parseFloat(formatEther(BigInt(rawBalance))).toFixed(2)
    : "";
};
