import { useEvents } from "hooks/events/useEvents";

import { Event } from "types/events";
import { useWatchContractEvent } from "wagmi/dist/types/hooks/useWatchContractEvent";

export const useContractEvent = ({
  address,
  abi,
  //blockchain event name
  eventName,
  storageKey,
  // internal event kind
  eventKind,
}: {
  address: `0x${string}`;
  abi: any;
  eventName: string;
  storageKey: string;
  eventKind: Event;
}) => {
  const { emit, events$ } = useEvents({
    eventKind,
    key: storageKey,
  });

  useWatchContractEvent({
    address,
    abi,
    eventName,
    onLogs: (logs: any[]) => {
      logs.forEach((log) => {
        console.log("log", log);
        emit(log);
      });
    },
  });
};
// import { config } from "config";
// import { holesky } from "viem/chains";
// import { useWatchContractEvent } from "wagmi";
// import { abi } from "./abi";
// import { useCallback } from "react";
// export const useWatchDepositPayments = () => {
//   const onLogs = useCallback((logs: any) => {
//     console.log("Deposit", logs);
//   }, []);

//   useWatchContractEvent({
//     address: config.depositContractAddress[holesky.id],
//     abi: abi,
//     eventName: "DepositFeeTransfer",
//     // args: {
//     //   owner: address,
//     //   spender: requestor?.wallet,
//     // },
//     onLogs: onLogs,
//   });
// };
