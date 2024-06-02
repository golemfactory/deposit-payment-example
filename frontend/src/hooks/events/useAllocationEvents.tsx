import { merge } from "rxjs";
import { useCreateAllocationEvents } from "./useCreateAllocationEvents";
import { useReleaseAllocationEvents } from "./useReleaseAllocationEvents";

export const useAllocationEvents = () => {
  const { events$: createAllocationEvents$ } = useCreateAllocationEvents();
  const { events$: releaseAllocationEvents$ } = useReleaseAllocationEvents();

  return {
    events$: merge([createAllocationEvents$, releaseAllocationEvents$]),
  };
};
