import { config } from "config";
import { holesky } from "viem/chains";
import { useWatchContractEvent } from "wagmi";
import { abi } from "./abi";
import { useCallback } from "react";
export const useWatchDepositPayments = () => {
  const onLogs = useCallback((logs) => {
    console.log("Deposit", logs);
  }, []);

  useWatchContractEvent({
    address: config.depositContractAddress[holesky.id],
    abi: abi,
    eventName: "DepositFeeTransfer",
    // args: {
    //   owner: address,
    //   spender: requestor?.wallet,
    // },
    onLogs: onLogs,
  });
};
