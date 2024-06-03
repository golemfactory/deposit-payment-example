import { Event } from "types/events";
import { useEvents } from "./useEvents";

export const useReleaseAllocationEvents = () => {
  return useEvents({
    eventKind: Event.ALLOCATION_RELEASED,
    key: "allocationReleasedEvents",
  });
};
