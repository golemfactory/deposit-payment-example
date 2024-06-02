import { useEffect, useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";
import { EventCard } from "./event";
import { uniqBy } from "ramda";
import { use } from "i18next";

export const Events = () => {
  const [events, setEvents] = useState<
    (EventType & {
      id: number;
      timestamp: number;
    })[]
  >([]);
  const { events$: allocationEvents$ } = useAllocationEvents();

  useEffect(() => {
    console.log("subscribing");
    const sub = allocationEvents$.subscribe((event) => {
      console.log("new event", event);
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
      console.log("unsubscribing");
    };
  }, [allocationEvents$]);

  return (
    <>
      {events.map((event, index) => {
        return <EventCard key={index} {...event} />;
      })}
    </>
  );
};
