import { merge } from "rxjs";
import { useCreateAllocationEvents } from "./useCreateAllocationEvents";
import { useReleaseAllocationEvents } from "./useReleaseAllocationEvents";

export const useAllocationEvents = () => {
  console.log("useAllocationEvents");
  const { events$: createAllocationEvents$ } = useCreateAllocationEvents();
  const { events$: releaseAllocationEvents$ } = useReleaseAllocationEvents();

  return {
    events$: merge(releaseAllocationEvents$, createAllocationEvents$),
  };
};