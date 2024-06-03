import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy } from "ramda";
import { useDepositEvents } from "hooks/events/useDepositEvents";
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

  useEffect(() => {
    const sub = merge(allocationEvents$, depositEvents$).subscribe((event) => {
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
      console.log("unsubscribing");
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
