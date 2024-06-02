import { useSyncExternalEvents } from "./useSyncExternalEvent";
import { Event } from "types/events";
export const useCreateAllocationEvents = () => {
  return useSyncExternalEvents({
    eventKind: Event.ALLOCATION_CREATED,
    key: "allocationCreatedEvents",
  });
};
