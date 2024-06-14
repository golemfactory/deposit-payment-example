import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy, sortBy, prop } from "ramda";
import { useDepositEvents } from "hooks/events/useDepositEvents";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { finalize, merge } from "rxjs";
import { useDepositPaymentEvents } from "hooks/events/usePaymentEvents";
import { useScanResults } from "hooks/useScanResults";
import { useFlowEvents } from "components/providers/flowEventsProvider";

export const Events = () => {
  const [events, setEvents] = useState<
    (EventType & {
      id: number;
      timestamp: number;
    })[]
  >([]);

  const { events$: allocationEvents$, clean: cleanAllocationEvents } =
    useAllocationEvents();
  const { events$: depositEvents$, clean: cleanDepositEvents } =
    useDepositEvents();
  const { events$: yagnaEvents$, clean: cleanYagnaEvents } = useYagnaEvents();
  const { events$: paymentEvents$, clean: cleanPaymentEvents } =
    useDepositPaymentEvents();
  const { events$: fileEvents$, clean: cleanFileEvents } = useScanResults();
  const { events$: flowEvents$ } = useFlowEvents();

  useEffect(() => {
    console.log("events", events);
    flowEvents$
      .pipe(
        finalize(() => {
          cleanAllocationEvents();
          cleanDepositEvents();
          cleanYagnaEvents();
          cleanPaymentEvents();
          cleanFileEvents();
          setEvents([]);
        })
      )
      .subscribe();
  }, []);

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
//@ts-ignore
window.cleanup = () => {
  localStorage.yagnaAgreementEvents = "";
  localStorage.yagnaDepositEvents = "";
  localStorage.yagnaDebitNoteEvents = "";
};
