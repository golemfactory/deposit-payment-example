import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy, sortBy, reverse, prop } from "ramda";
import { useDepositEvents } from "hooks/events/useDepositEvents";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { filter, finalize, merge } from "rxjs";
import { useDepositPaymentEvents } from "hooks/events/usePaymentEvents";
import { useScanResults } from "hooks/useScanResults";
import { useFlowEvents } from "components/providers/flowEventsProvider";

export const Events = () => {
  const [events, setEvents] = useState<
    (EventType & {
      id: number;
      timestamp: number;
      isExpanded: boolean;
      toggleExpanded: () => void;
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
    flowEvents$
      .pipe(
        filter((event) => event === "restartSession") // Adjust the condition to match your event structure
      )
      .subscribe(() => {
        cleanAllocationEvents();
        cleanDepositEvents();
        cleanYagnaEvents();
        cleanPaymentEvents();
        cleanFileEvents();
        setEvents([]);
      });
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
          return reverse(
            sortBy(prop("timestamp"))(
              uniqBy(
                (e) => {
                  return `${e.kind}-${e.id}`;
                },
                [
                  ...prevEvents.map((e) => {
                    return {
                      ...e,
                    };
                  }),
                  {
                    ...event,
                    isExpanded: true,
                  },
                ]
              )
            )
          ).map((e, index) => {
            return {
              ...e,
              isExpanded: index === 0,

              toggleExpanded: () => {
                setEvents((prevEvents) => {
                  return prevEvents.map((prevEvent) => {
                    return {
                      ...prevEvent,
                      isExpanded:
                        e.id === prevEvent.id
                          ? !prevEvent.isExpanded
                          : prevEvent.isExpanded,
                    };
                  });
                });
              },
            };
          });
        });
      }
    );
    return () => {
      //TODO: fix this
      setTimeout(() => {
        sub.unsubscribe();
      }, 1000);
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
