import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy } from "ramda";
import { useDepositEvents } from "hooks/events/useDepositEvents";
import { useYagnaEvents } from "hooks/events/useYagnaEvents";
import { merge } from "rxjs";

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

  useEffect(() => {
    const sub = merge(
      allocationEvents$,
      depositEvents$,
      yagnaEvents$
    ).subscribe((event) => {
      setEvents((prevEvents) => {
        return uniqBy(
          (e) => {
            return `${e.kind}-${e.id}`;
          },
          [...prevEvents, event]
        );
      });
    });
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
