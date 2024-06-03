import { merge } from "rxjs";
import { useDepositReleasedEvents } from "./useDepositReleasedEvents";
import { useDepositCreatedEvents } from "./useDepositCreatedEvents";

export const useDepositEvents = () => {
  const { events$: depositCreatedEvents$ } = useDepositCreatedEvents();
  const { events$: depositReleasedEvents$ } = useDepositReleasedEvents();

  return {
    events$: merge(depositReleasedEvents$, depositCreatedEvents$),
  };
};
