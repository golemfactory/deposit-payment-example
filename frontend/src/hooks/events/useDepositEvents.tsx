import { merge } from "rxjs";
import { useDepositReleasedEvents } from "./useDepositReleasedEvents";
import { useDepositCreatedEvents } from "./useDepositCreatedEvents";
import { useDepositExtendedEvents } from "./useDepositExtendedEvents";

export const useDepositEvents = () => {
  const { events$: depositCreatedEvents$, clean: cleanDepositCreatedEvents } =
    useDepositCreatedEvents();
  const { events$: depositReleasedEvents$, clean: cleanDepositReleasedEvents } =
    useDepositReleasedEvents();
  const { events$: depositExtendedEvents$, clean: cleanDepositExtendedEvents } =
    useDepositExtendedEvents();
  return {
    events$: merge(
      depositReleasedEvents$,
      depositCreatedEvents$,
      depositExtendedEvents$
    ),
    clean: () => {
      cleanDepositCreatedEvents();
      cleanDepositReleasedEvents();
      cleanDepositExtendedEvents();
    },
  };
};
