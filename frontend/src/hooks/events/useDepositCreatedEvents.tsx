import { Event } from "types/events";
import { useEvents } from "./useEvents";
export const useDepositCreatedEvents = () => {
  return useEvents({
    eventKind: Event.DEPOSIT_CREATED,
    key: "depositCreatedEvents",
  });
};
