import { merge } from "rxjs";
import { useDepositReleasedEvents } from "./useDepositReleasedEvents";
import { useDepositCreatedEvents } from "./useDepositCreatedEvents";
import { useDepositExtendedEvents } from "./useDepositExtendedEvents";

export const useDepositEvents = () => {
  const { events$: depositCreatedEvents$ } = useDepositCreatedEvents();
  const { events$: depositReleasedEvents$ } = useDepositReleasedEvents();
  const { events$: depositExtendedEvents$ } = useDepositExtendedEvents();
  return {
    events$: merge(
      depositReleasedEvents$,
      depositCreatedEvents$,
      depositExtendedEvents$
    ),
  };
};
