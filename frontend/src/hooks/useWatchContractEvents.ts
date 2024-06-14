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
        emit(log);
      });
    },
  });
};
