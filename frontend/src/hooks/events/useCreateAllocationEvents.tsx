import { Event } from "types/events";
import { useEvents } from "./useEvents";
export const useCreateAllocationEvents = () => {
  return useEvents({
    eventKind: Event.ALLOCATION_CREATED,
    key: "allocationCreatedEvents",
  });
};
