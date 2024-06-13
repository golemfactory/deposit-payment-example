import { merge } from "rxjs";
import { useCreateAllocationEvents } from "./useCreateAllocationEvents";
import { useReleaseAllocationEvents } from "./useReleaseAllocationEvents";

export const useAllocationEvents = () => {
  const {
    events$: createAllocationEvents$,
    clean: cleanCreateAllocationEvents,
  } = useCreateAllocationEvents();
  const {
    events$: releaseAllocationEvents$,
    clean: cleanReleaseAllocationEvents,
  } = useReleaseAllocationEvents();

  return {
    events$: merge(releaseAllocationEvents$, createAllocationEvents$),
    clean: () => {
      cleanCreateAllocationEvents();
      cleanReleaseAllocationEvents();
    },
  };
};
