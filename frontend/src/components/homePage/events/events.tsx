import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy, sortBy, prop } from "ramda";
import { useDepositEvents } from "hooks/events/useDepositEvents";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { merge } from "rxjs";
import { useDepositPaymentEvents } from "hooks/events/usePaymentEvents";
import { useScanResults } from "hooks/useScanResults";

export const Events = () => {
  const [events, setEvents] = useState<
    (EventType & {
      id: number;
      timestamp: number;
    })[]
  >([]);

  const { events$: allocationEvents$ } = useAllocationEvents();
  const { events$: depositEvents$ } = useDepositEvents();
  const { events$: yagnaEvents$ } = useYagnaEvents();
  const { events$: paymentEvents$ } = useDepositPaymentEvents();
  const { events$: fileEvents$ } = useScanResults();

  useEffect(() => {
    const sub = merge(
      allocationEvents$,
      depositEvents$,
      yagnaEvents$,
      paymentEvents$,
      fileEvents$
    ).subscribe(
      (
        event: EventType & {
          id: number;
          timestamp: number;
        }
      ) => {
        setEvents((prevEvents) => {
          return sortBy(prop("timestamp"))(
            uniqBy(
              (e) => {
                return `${e.kind}-${e.id}`;
              },
              [...prevEvents, event]
            )
          );
        });
      }
    );
    return () => {
      //TODO: fix this
      setTimeout(() => {
        sub.unsubscribe();
      }, 0);
    };
  }, []);

  return (
    <>
      {events.map((event, index) => {
        return <EventCard key={index} {...event} />;
      })}
    </>
  );
};

window.cleanup = () => {
  localStorage.yagnaAgreementEvents = "";
  localStorage.yagnaDepositEvents = "";
  localStorage.yagnaDebitNoteEvents = "";
};
