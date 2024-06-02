import { useSyncExternalEvents } from "./useSyncExternalEvent";

import { Event } from "types/events";

export const useReleaseAllocationEvents = () => {
  return useSyncExternalEvents({
    eventKind: Event.ALLOCATION_RELEASED,
    key: "allocationReleasedEvents",
  });
};
