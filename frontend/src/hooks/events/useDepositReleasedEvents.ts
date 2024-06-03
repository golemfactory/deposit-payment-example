import { Event } from "types/events";
import { useEvents } from "./useEvents";
export const useDepositReleasedEvents = () => {
  return useEvents({
    eventKind: Event.DEPOSIT_CREATED,
    key: "allocationCreatedEvents",
  });
};
