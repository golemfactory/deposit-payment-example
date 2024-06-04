import { Event } from "types/events";
import { useEvents } from "./useEvents";
export const useDepositExtendedEvents = () => {
  return useEvents({
    eventKind: Event.DEPOSIT_EXTENDED,
    key: "depositExtendedEvents",
  });
};
